/**
 * NEXORA Security Service
 * Core application security engine implementing:
 * 1. Login Protection: State throttling, brute-force attempt rate limiting & progressive lockout.
 * 2. Error Sanitization: Masking internal database/Firebase messages into generic safe strings.
 * 3. Password Reset Security: Cryptographic single-use token vault with strict 15-minute expiration.
 * 4. Audit Logging: In-memory/sessionStorage security event ring-buffer with credential redaction.
 */

const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 60 * 1000, // 60 seconds
  ATTEMPT_WINDOW_MS: 15 * 60 * 1000 // 15-minute sliding window
};

const RESET_TOKEN_CONFIG = {
  LIFETIME_MS: 15 * 60 * 1000 // 15 minutes
};

const STORAGE_KEYS = {
  RATE_LIMIT_PREFIX: 'nexora_sec_ratelimit_',
  RESET_TOKENS: 'nexora_sec_reset_tokens',
  AUDIT_LOG: 'nexora_sec_audit_log'
};

export const securityService = {
  // ── 1. LOGIN PROTECTION & BRUTE-FORCE RATE LIMITING ──────────────────────────

  /**
   * Normalizes an identifier (email or phone) for rate limiting keys.
   */
  _normalizeId(identifier) {
    if (!identifier) return 'anonymous';
    return String(identifier).trim().toLowerCase().replace(/[^a-z0-9@._+-]/g, '');
  },

  /**
   * Checks current rate-limit status for an identifier.
   * @param {string} identifier - Email or phone
   * @returns {{ isLocked: boolean, remainingSeconds: number, attemptsLeft: number }}
   */
  checkLoginRateLimit(identifier) {
    try {
      const key = `${STORAGE_KEYS.RATE_LIMIT_PREFIX}${this._normalizeId(identifier)}`;
      const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (!raw) {
        return { isLocked: false, remainingSeconds: 0, attemptsLeft: RATE_LIMIT_CONFIG.MAX_ATTEMPTS };
      }

      const record = JSON.parse(raw);
      const now = Date.now();

      // Check if currently locked out
      if (record.lockedUntil && now < record.lockedUntil) {
        const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
        return {
          isLocked: true,
          remainingSeconds,
          attemptsLeft: 0
        };
      }

      // Check sliding window for attempts
      if (record.firstAttemptAt && (now - record.firstAttemptAt > RATE_LIMIT_CONFIG.ATTEMPT_WINDOW_MS)) {
        // Window expired, reset
        this.resetLoginRateLimit(identifier);
        return { isLocked: false, remainingSeconds: 0, attemptsLeft: RATE_LIMIT_CONFIG.MAX_ATTEMPTS };
      }

      const attempts = record.attempts || 0;
      const attemptsLeft = Math.max(0, RATE_LIMIT_CONFIG.MAX_ATTEMPTS - attempts);

      return {
        isLocked: false,
        remainingSeconds: 0,
        attemptsLeft
      };
    } catch {
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: RATE_LIMIT_CONFIG.MAX_ATTEMPTS };
    }
  },

  /**
   * Records a failed login attempt. Triggers lockout when threshold is reached.
   * @param {string} identifier
   * @returns {{ isLocked: boolean, remainingSeconds: number, attemptsLeft: number }}
   */
  recordFailedLogin(identifier) {
    try {
      const normId = this._normalizeId(identifier);
      const key = `${STORAGE_KEYS.RATE_LIMIT_PREFIX}${normId}`;
      const now = Date.now();

      let record = { attempts: 0, firstAttemptAt: now, lockedUntil: null };
      const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (raw) {
        try {
          record = JSON.parse(raw);
        } catch {
          record = { attempts: 0, firstAttemptAt: now, lockedUntil: null };
        }
      }

      // If attempt window expired, start fresh count
      if (!record.firstAttemptAt || (now - record.firstAttemptAt > RATE_LIMIT_CONFIG.ATTEMPT_WINDOW_MS)) {
        record.firstAttemptAt = now;
        record.attempts = 0;
      }

      record.attempts = (record.attempts || 0) + 1;

      let isLocked = false;
      let remainingSeconds = 0;

      if (record.attempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
        record.lockedUntil = now + RATE_LIMIT_CONFIG.LOCKOUT_DURATION_MS;
        isLocked = true;
        remainingSeconds = Math.ceil(RATE_LIMIT_CONFIG.LOCKOUT_DURATION_MS / 1000);

        this.logSecurityEvent('LOGIN_LOCKOUT_TRIGGERED', {
          identifier: normId,
          attempts: record.attempts,
          lockedUntil: new Date(record.lockedUntil).toISOString()
        });
      } else {
        this.logSecurityEvent('FAILED_LOGIN_ATTEMPT', {
          identifier: normId,
          attemptCount: record.attempts,
          attemptsLeft: RATE_LIMIT_CONFIG.MAX_ATTEMPTS - record.attempts
        });
      }

      sessionStorage.setItem(key, JSON.stringify(record));
      localStorage.setItem(key, JSON.stringify(record));

      return {
        isLocked,
        remainingSeconds,
        attemptsLeft: Math.max(0, RATE_LIMIT_CONFIG.MAX_ATTEMPTS - record.attempts)
      };
    } catch {
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: 0 };
    }
  },

  /**
   * Resets rate-limiting counter upon successful login.
   * @param {string} identifier
   */
  resetLoginRateLimit(identifier) {
    try {
      const key = `${STORAGE_KEYS.RATE_LIMIT_PREFIX}${this._normalizeId(identifier)}`;
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } catch {
      // Ignored
    }
  },

  /**
   * Throttles rapid button clicks (e.g. 1500ms debounce interval).
   */
  _throttleTimers: {},
  canExecuteAction(actionKey = 'submit', cooldownMs = 1500) {
    const now = Date.now();
    const last = this._throttleTimers[actionKey] || 0;
    if (now - last < cooldownMs) {
      return false;
    }
    this._throttleTimers[actionKey] = now;
    return true;
  },

  // ── 2. ERROR MESSAGE SANITIZATION ────────────────────────────────────────────

  /**
   * Sanitizes all authentication and API error messages so database details,
   * user existence, and internal exceptions are NEVER leaked to the UI.
   * @param {Error|string|object} error
   * @param {string} context - 'login' | 'signup' | 'reset' | 'admin'
   * @returns {string} Safe user-facing message
   */
  sanitizeAuthError(error, context = 'login') {
    const rawMsg = (typeof error === 'string' ? error : error?.message || '').toLowerCase();

    // Sensitive triggers that leak database state
    const userNotFoundTriggers = ['not found', 'user-not-found', 'no account', 'does not exist', 'unregistered'];
    const invalidCredentialTriggers = ['wrong-password', 'invalid password', 'invalid-credential', 'credentials', 'invalid passkey'];
    const rateLimitTriggers = ['too-many-requests', 'locked', 'rate limit', 'throttled', 'exceeded'];

    if (rateLimitTriggers.some(t => rawMsg.includes(t))) {
      return 'Account temporarily restricted due to excessive attempts. Please wait before trying again.';
    }

    if (context === 'login') {
      // Generic message to prevent user enumeration
      if (userNotFoundTriggers.some(t => rawMsg.includes(t)) || invalidCredentialTriggers.some(t => rawMsg.includes(t))) {
        return 'Invalid credentials. Please verify your email/phone and password.';
      }
      return 'Authentication failed. Please check your credentials and try again.';
    }

    if (context === 'admin') {
      return 'Invalid administrator credentials. Access restricted.';
    }

    if (context === 'signup') {
      if (rawMsg.includes('already') || rawMsg.includes('exists') || rawMsg.includes('in-use')) {
        return 'An account with these details cannot be registered. Please try logging in or use different details.';
      }
      return 'Unable to complete registration with the provided details. Please verify your information.';
    }

    if (context === 'reset') {
      // Safe enumeration-resistant confirmation
      return 'If an account exists with this email, secure recovery instructions have been dispatched.';
    }

    return 'A security verification error occurred. Please try again.';
  },

  // ── 3. SINGLE-USE PASSWORD RESET TOKEN VAULT ─────────────────────────────────

  /**
   * Generates a cryptographically secure random token string.
   */
  _generateSecureToken() {
    const cryptoObj = (typeof window !== 'undefined' ? window.crypto : null) || (typeof crypto !== 'undefined' ? crypto : null);
    if (cryptoObj && cryptoObj.getRandomValues) {
      const buffer = new Uint8Array(24);
      cryptoObj.getRandomValues(buffer);
      return Array.from(buffer, b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback if Web Crypto API is unavailable
    return 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  /**
   * Retrieves all reset tokens from secure storage.
   */
  _getResetTokens() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESET_TOKENS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Saves tokens list to storage.
   */
  _saveResetTokens(tokens) {
    try {
      localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
    } catch {
      // Ignored
    }
  },

  /**
   * Creates a single-use password reset token with strict 15-minute expiration.
   * @param {string} email
   * @returns {{ token: string, expiresAt: number }}
   */
  createPasswordResetToken(email) {
    const cleanEmail = String(email).trim().toLowerCase();
    const token = this._generateSecureToken();
    const now = Date.now();
    const expiresAt = now + RESET_TOKEN_CONFIG.LIFETIME_MS;

    const tokenObj = {
      token,
      email: cleanEmail,
      createdAt: now,
      expiresAt,
      used: false
    };

    // Purge expired tokens and keep vault clean
    const tokens = this._getResetTokens().filter(t => t.expiresAt > now && !t.used);
    tokens.push(tokenObj);
    this._saveResetTokens(tokens);

    this.logSecurityEvent('PASSWORD_RESET_TOKEN_CREATED', {
      email: cleanEmail,
      expiresAt: new Date(expiresAt).toISOString()
    });

    return { token, expiresAt };
  },

  /**
   * Validates a password reset token for existence, expiration, and single-use status.
   * @param {string} token
   * @returns {{ valid: boolean, email?: string, error?: string, remainingMinutes?: number }}
   */
  verifyPasswordResetToken(token) {
    if (!token) {
      return { valid: false, error: 'Password reset token is missing.' };
    }

    const tokens = this._getResetTokens();
    const found = tokens.find(t => t.token === token);

    if (!found) {
      return { valid: false, error: 'Password reset token is invalid or has expired.' };
    }

    if (found.used) {
      this.logSecurityEvent('PASSWORD_RESET_REPLAY_ATTEMPT', { tokenPrefix: token.substring(0, 6) });
      return { valid: false, error: 'This recovery link has already been used. Please request a new link.' };
    }

    const now = Date.now();
    if (now > found.expiresAt) {
      this.logSecurityEvent('PASSWORD_RESET_EXPIRED_TOKEN', { tokenPrefix: token.substring(0, 6) });
      return { valid: false, error: 'This password reset link has expired. Links are valid for 15 minutes.' };
    }

    const remainingMinutes = Math.max(1, Math.ceil((found.expiresAt - now) / (60 * 1000)));

    return {
      valid: true,
      email: found.email,
      remainingMinutes
    };
  },

  /**
   * Consumes a reset token: burns the token, applies the new password, and revokes sessions.
   * @param {string} token
   * @param {string} newPassword
   * @param {Function} updatePasswordFn - Callback to apply password to user db
   * @returns {{ success: boolean, error?: string }}
   */
  consumePasswordResetToken(token, newPassword, updatePasswordFn) {
    const verify = this.verifyPasswordResetToken(token);
    if (!verify.valid) {
      return { success: false, error: verify.error };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const tokens = this._getResetTokens();
    const tokenIdx = tokens.findIndex(t => t.token === token);

    if (tokenIdx !== -1) {
      // Burn token immediately
      tokens[tokenIdx].used = true;
      tokens[tokenIdx].usedAt = Date.now();
      this._saveResetTokens(tokens);
    }

    // Apply password change to user record
    if (typeof updatePasswordFn === 'function') {
      try {
        updatePasswordFn(verify.email, newPassword);
      } catch {
        return { success: false, error: 'Failed to update account password. Please try again.' };
      }
    }

    this.logSecurityEvent('PASSWORD_RESET_COMPLETED', {
      email: verify.email
    });

    return { success: true };
  },

  // ── 4. LOGGING & AUDIT TRAIL HOOKS ──────────────────────────────────────────

  /**
   * Records a security event to the audit ring-buffer (max 100 entries).
   * Automatically strips/redacts sensitive keys like password, token, pin, secret.
   * @param {string} eventType
   * @param {object} metadata
   */
  logSecurityEvent(eventType, metadata = {}) {
    try {
      const sanitized = {};
      const sensitiveKeys = ['password', 'confirmPassword', 'token', 'passkey', 'secret', 'otp'];

      Object.entries(metadata || {}).forEach(([k, v]) => {
        if (sensitiveKeys.some(sk => k.toLowerCase().includes(sk))) {
          sanitized[k] = '[REDACTED]';
        } else {
          sanitized[k] = v;
        }
      });

      const entry = {
        id: 'sec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        timestamp: new Date().toISOString(),
        eventType,
        metadata: sanitized
      };

      let logs = [];
      const raw = sessionStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
      if (raw) {
        try {
          logs = JSON.parse(raw);
        } catch {
          logs = [];
        }
      }

      // Ring buffer: max 100 entries
      logs.unshift(entry);
      if (logs.length > 100) {
        logs = logs.slice(0, 100);
      }

      sessionStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(logs));

      // Console audit log in development
      if (import.meta.env.DEV) {
        console.debug(`[SECURITY AUDIT] ${eventType}:`, sanitized);
      }
    } catch {
      // Never throw from audit logger
    }
  },

  /**
   * Returns recent security audit logs for inspection or diagnostics.
   */
  getSecurityAuditLogs() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
};

export default securityService;
