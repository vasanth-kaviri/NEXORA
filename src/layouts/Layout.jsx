import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, User, Bell, ArrowLeft, Rocket } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Pages that shouldn't show the bottom nav at all
  const hideNavPaths = ['/', '/onboarding', '/login', '/signup', '/forgot-password', '/complete-profile', '/chatbot'];
  
  // Module pages that only show a top "Back to Home" button and NO bottom nav
  const modulePaths = [
    '/jobs', '/scholarships', '/peer-learning', 
    '/resume', '/resume-analyzer', '/mock-interview', '/colleges', 
    '/skill-gap', '/assessments', '/quiz', '/resources', '/achievements',
    '/settings', '/help', '/about', '/profile', 
    '/settings/notifications', '/settings/privacy', '/settings/language',
    '/subscription', '/projects', '/hackathons', '/career-goal', '/progress'
  ];

  const isModulePage = modulePaths.includes(location.pathname) || location.pathname.startsWith('/task/') || location.pathname.startsWith('/resource/') || location.pathname.startsWith('/notification/');
  const showNav = !hideNavPaths.includes(location.pathname) && !isModulePage;
  const showBackButton = !hideNavPaths.includes(location.pathname) && location.pathname !== '/dashboard';

  return (
    <div className="app-container transform-gpu" style={{ transform: 'translateZ(0)' }}>
      <main className="page-content transform-gpu will-change-transform" style={{ padding: 0, paddingBottom: showNav ? 'calc(68px + var(--space-md))' : (location.pathname === '/chatbot' ? 0 : 'var(--space-md)'), backfaceVisibility: 'hidden' }}>
        {showBackButton && (
          <div style={{ padding: '8px 16px', position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-xs text-primary interactive" 
              style={{ fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, margin: 0, fontSize: '0.88rem' }}
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>
        )}
        <div style={{ padding: location.pathname === '/chatbot' ? 0 : 'var(--space-md)', paddingTop: showBackButton ? '8px' : (location.pathname === '/chatbot' ? 0 : 'var(--space-md)') }}>
          <Outlet />
        </div>
      </main>

      {showNav && (
        <nav className="bottom-nav glass-panel">
          <button 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <Home size={24} />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-item ${location.pathname === '/roadmap' ? 'active' : ''}`}
            onClick={() => navigate('/roadmap')}
          >
            <Compass size={24} />
            <span>Roadmap</span>
          </button>

          <button 
            className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}
            onClick={() => navigate('/notifications')}
          >
            <Bell size={24} />
            <span>Alerts</span>
          </button>
          
          <button 
            className={`nav-item ${location.pathname === '/explore' ? 'active' : ''}`}
            onClick={() => navigate('/explore')}
          >
            <Rocket size={24} />
            <span>Explore</span>
          </button>
        </nav>
      )}
    </div>
  );
}
