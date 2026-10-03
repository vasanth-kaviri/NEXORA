import { Navigate, Outlet, useLocation } from 'react-router-dom';
import db from '../../services/db';
import securityService from '../../services/securityService';

/**
 * AdminRoute Guard
 * Enforces Checkpoint 7 (Role-Based Access Control / RBAC).
 * Strictly restricts /admin/* endpoints to authenticated administrators.
 */
export default function AdminRoute() {
  const location = useLocation();
  const isAdmin = db.isAdminAuthenticated();

  if (!isAdmin) {
    securityService.logSecurityEvent('ADMIN_RBAC_DENIED', {
      attemptedPath: location.pathname,
      timestamp: new Date().toISOString()
    });
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
