import React from 'react';
import { ShieldAlert, RefreshCw, Home, LogOut } from 'lucide-react';
import securityService from '../../services/securityService';

/**
 * ErrorBoundary Component
 * Enforces Checkpoint 8 (Logging & Monitoring Hooks).
 * Catches unhandled runtime exceptions, logs security incident telemetry,
 * and presents an enterprise-grade recovery interface.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      incidentId: null,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    const incidentId = 'NEX-ERR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      hasError: true,
      incidentId,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    const incidentId = this.state.incidentId || ('NEX-ERR-' + Date.now().toString(36).toUpperCase());
    
    // Log security telemetry with sanitized stack
    securityService.logSecurityEvent('UNHANDLED_RUNTIME_EXCEPTION', {
      incidentId,
      message: error?.message || 'Unknown component crash',
      componentStack: errorInfo?.componentStack?.substring(0, 500)
    });

    console.error(`[NEXORA ErrorBoundary Intercepted ${incidentId}]:`, error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  handleResetSession = () => {
    localStorage.removeItem('nexora_session');
    localStorage.removeItem('nexora_admin_session');
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="flex flex-col items-center justify-center p-6" 
          style={{ 
            minHeight: '100vh', 
            width: '100%', 
            backgroundColor: 'var(--bg-main, #0a0c10)',
            color: 'var(--text-main, #ffffff)',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        >
          <div 
            className="glass-panel animate-fade-in flex flex-col items-center text-center p-8 max-w-lg w-full rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Warning Shield Graphic */}
            <div 
              style={{ 
                width: 68, 
                height: 68, 
                borderRadius: '50%', 
                background: 'rgba(239, 68, 68, 0.12)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '1.25rem',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <ShieldAlert size={36} className="text-red-400" />
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Workspace Exception Caught
            </h1>

            <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              An isolated runtime error occurred in this workspace component. Our frontend monitoring hooks have trapped the exception safely.
            </p>

            {/* Incident Reference Pill */}
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-xs font-mono"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-main, #e2e8f0)'
              }}
            >
              <span style={{ opacity: 0.6 }}>Incident ID:</span>
              <strong style={{ color: '#60a5fa' }}>{this.state.incidentId}</strong>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.88rem'
                }}
              >
                <RefreshCw size={16} />
                <span>Reload Workspace</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: 'var(--text-main, #ffffff)',
                  fontWeight: '500',
                  fontSize: '0.88rem'
                }}
              >
                <Home size={16} />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Reset Session Alternative */}
            <div className="mt-5 pt-4 w-full" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                type="button"
                onClick={this.handleResetSession}
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign out &amp; reset workspace cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
