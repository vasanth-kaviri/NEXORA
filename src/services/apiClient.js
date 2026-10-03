/**
 * NEXORA Secure API Client
 * Centralized HTTP service abstraction enforcing:
 * 1. Bearer Token Authorization headers
 * 2. Distributed Tracing headers (X-Request-ID, X-Client-Timestamp, X-Client-Version)
 * 3. Payload sanitization (stripping XSS/injection vectors)
 * 4. Response interception for automatic 401/403 session revocation
 */

import securityService from './securityService.js';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';

/**
 * Generates a crypto-secure UUID v4 string for distributed request tracing.
 */
function generateRequestId() {
  const cryptoObj = (typeof window !== 'undefined' ? window.crypto : null) || (typeof crypto !== 'undefined' ? crypto : null);
  if (cryptoObj && cryptoObj.randomUUID) {
    return cryptoObj.randomUUID();
  }
  return 'req_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
}

let inMemoryToken = null;

export function setActiveBearerToken(token) {
  inMemoryToken = token;
  if (token && typeof token === 'string' && token.trim()) {
    try {
      localStorage.setItem('nexora_token', token.trim());
    } catch {
      // Ignored
    }
  }
}

/**
 * Retrieves the current session Bearer token.
 * Reads 'nexora_token' directly from localStorage with backward-compatibility fallback.
 */
export function getActiveBearerToken() {
  if (inMemoryToken) return inMemoryToken;
  try {
    const directToken = localStorage.getItem('nexora_token');
    if (directToken && typeof directToken === 'string' && directToken.trim()) {
      return directToken.trim();
    }
  } catch {
    return null;
  }
  return null;
}

const SENSITIVE_RAW_KEYS = new Set([
  'password',
  'confirmPassword',
  'currentPassword',
  'newPassword',
  'token',
  'accessToken',
  'refreshToken'
]);

/**
 * Sanitizes request payload objects, recursively stripping potential script injection tags
 * while strictly preserving raw password strings and credential tokens untouched.
 * @param {any} data
 * @param {string} [keyContext='']
 * @returns {any} Sanitized clone
 */
export function sanitizePayload(data, keyContext = '') {
  if (data === null || data === undefined) return data;
  if (keyContext && SENSITIVE_RAW_KEYS.has(keyContext)) {
    return data;
  }
  if (typeof data === 'string') {
    // Strip common script tags and dangerous HTML attributes
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror=/gi, '')
      .replace(/onload=/gi, '');
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizePayload(item));
  }
  if (typeof data === 'object') {
    const sanitizedObj = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_RAW_KEYS.has(key)) {
        sanitizedObj[key] = value;
      } else {
        sanitizedObj[key] = sanitizePayload(value, key);
      }
    }
    return sanitizedObj;
  }
  return data;
}

/**
 * Core secure fetch dispatcher
 */
async function secureFetch(endpoint, options = {}) {
  let finalEndpoint = endpoint;
  if (options.params && typeof options.params === 'object') {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(options.params)) {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    }
    const qs = searchParams.toString();
    if (qs) {
      finalEndpoint += (finalEndpoint.includes('?') ? '&' : '?') + qs;
    }
  }

  const url = finalEndpoint.startsWith('http') ? finalEndpoint : `${API_BASE_URL}${finalEndpoint}`;
  const requestId = generateRequestId();
  const token = getActiveBearerToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Request-ID': requestId,
    'X-Client-Timestamp': new Date().toISOString(),
    'X-Client-Version': '1.0.0',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(sanitizePayload(body));
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body
    });

    // ── 401 INTERCEPTOR WITH REFRESH TOKEN VERIFICATION & LOOP GUARDS ───────
    if (response.status === 401) {
      // 1. Guard against infinite refresh recursion:
      // Strictly exclude refresh and login endpoints from ever triggering refresh
      const isAuthRoute = endpoint.includes('/auth/refresh') || endpoint.includes('/auth/login');
      const refreshToken = (() => {
        try {
          return localStorage.getItem('nexora_refresh_token');
        } catch {
          return null;
        }
      })();

      // 2. Attempt token refresh if refreshToken exists and this is not a retry
      if (refreshToken && !options._isRetry && !isAuthRoute) {
        try {
          const refreshUrl = endpoint.startsWith('http')
            ? new URL('/api/v1/auth/refresh', endpoint).toString()
            : `${API_BASE_URL}/api/v1/auth/refresh`;

          const refreshRes = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Request-ID': generateRequestId()
            },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData?.data?.accessToken;
            const newRefreshToken = refreshData?.data?.refreshToken;
            if (newAccessToken) {
              setActiveBearerToken(newAccessToken);
              try {
                localStorage.setItem('nexora_token', newAccessToken);
                if (newRefreshToken) {
                  localStorage.setItem('nexora_refresh_token', newRefreshToken);
                }
              } catch {
                // Ignored
              }

              // Replay original request once with refreshed token
              return secureFetch(endpoint, {
                ...options,
                _isRetry: true
              });
            }
          } else {
            // Refresh request itself failed (expired or invalid refresh token):
            // Then and only then purge tokens and cleanly notify to redirect to /login
            securityService.logSecurityEvent('REFRESH_TOKEN_FAILED', {
              status: refreshRes.status,
              endpoint,
              requestId
            });

            inMemoryToken = null;
            try {
              localStorage.removeItem('nexora_token');
              localStorage.removeItem('nexora_refresh_token');
              localStorage.removeItem('nexora_user');
            } catch {
              // Ignored
            }

            window.dispatchEvent(new CustomEvent('auth_unauthorized', {
              detail: { status: 401, message: 'Refresh token expired. Please log in again.' }
            }));

            return {
              success: false,
              status: 401,
              error: 'Session expired. Please log in again.'
            };
          }
        } catch (refreshErr) {
          console.warn('[apiClient] Session token refresh network exception:', refreshErr?.message);
        }
      }

      // 3. If no refresh token exists or on transient 401s:
      // DO NOT immediately wipe 'nexora_token' or force-redirect during initial page load/reloads!
      securityService.logSecurityEvent('UNAUTHORIZED_API_RESPONSE', {
        status: response.status,
        endpoint,
        requestId
      });

      let errorMsg = 'Unauthorized or session token invalid.';
      try {
        const errorJson = await response.json();
        if (errorJson?.message) {
          errorMsg = errorJson.message;
        } else if (errorJson?.error) {
          errorMsg = errorJson.error;
        }
      } catch {
        // Ignored
      }

      return {
        success: false,
        status: response.status,
        error: errorMsg
      };
    }

    // ── 403 FORBIDDEN INTERCEPTOR ───────────────────────────────────────────
    if (response.status === 403) {
      securityService.logSecurityEvent('FORBIDDEN_API_RESPONSE', {
        status: response.status,
        endpoint,
        requestId
      });

      return {
        success: false,
        status: response.status,
        error: 'Access denied. You do not have permission to perform this action.'
      };
    }

    // Parse JSON response
    const contentType = response.headers.get('content-type') || '';
    let responseData = null;
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const rawError = (responseData && typeof responseData === 'object')
        ? (responseData.message || responseData.error)
        : responseData;
      // Preserve exact validation / bad-request error messages from backend
      const finalError = (response.status === 400 && rawError)
        ? rawError
        : securityService.sanitizeAuthError(rawError || 'API request failed.');
      return {
        success: false,
        status: response.status,
        error: finalError,
        data: responseData
      };
    }

    return {
      success: true,
      status: response.status,
      data: responseData
    };
  } catch (netErr) {
    securityService.logSecurityEvent('API_NETWORK_EXCEPTION', {
      endpoint,
      requestId,
      error: netErr.message
    });

    return {
      success: false,
      status: 0,
      error: 'Network connection issue or secure gateway unreachable. Please try again.'
    };
  }
}

export const apiClient = {
  get(endpoint, options = {}) {
    return secureFetch(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return secureFetch(endpoint, { ...options, method: 'POST', body });
  },

  put(endpoint, body, options = {}) {
    return secureFetch(endpoint, { ...options, method: 'PUT', body });
  },

  patch(endpoint, body, options = {}) {
    return secureFetch(endpoint, { ...options, method: 'PATCH', body });
  },

  delete(endpoint, options = {}) {
    return secureFetch(endpoint, { ...options, method: 'DELETE' });
  },

  setActiveBearerToken,
  getActiveBearerToken,
  sanitizePayload
};

export default apiClient;
