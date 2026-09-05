import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Compass, User, Bell, ArrowLeft, Rocket, 
  FolderKanban, Trophy, BookOpen, Bot, Settings, 
  Sun, Moon, ChevronRight, Sparkles, Menu, X, Search, Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import db from '../services/db';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState({ firstName: 'Alex', dreamJob: 'Machine Learning Engineer', level: 5 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pages that shouldn't show global navigation shell (auth, onboarding, splash, chatbot standalone)
  const authPaths = ['/', '/onboarding', '/login', '/signup', '/forgot-password', '/complete-profile'];
  const isAuthPage = authPaths.includes(location.pathname);
  const isChatbot = location.pathname === '/chatbot';

  const refreshData = () => {
    const user = db.getCurrentUser();
    if (user) setCurrentUser(user);
    const notifs = db.getNotifications();
    const unread = notifs.filter(n => n.unread).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('notifications_updated', refreshData);
    window.addEventListener('user_session_changed', refreshData);
    return () => {
      window.removeEventListener('notifications_updated', refreshData);
      window.removeEventListener('user_session_changed', refreshData);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (isAuthPage) {
    return (
      <div className="app-container">
        <Outlet />
      </div>
    );
  }

  // Primary Navigation items
  const mainNavItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Roadmap', path: '/roadmap', icon: Compass },
    { label: 'Explore', path: '/explore', icon: Rocket },
    { label: 'Alerts', path: '/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
  ];

  const secondaryNavItems = [
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Hackathons', path: '/hackathons', icon: Trophy },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'AI Mentor', path: '/chatbot', icon: Bot },
    { label: 'About NEXORA', path: '/about', icon: Info },
  ];

  // Route breadcrumbs generator
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return { section: 'Workspace', title: 'Dashboard' };
    if (path === '/roadmap') return { section: 'Career Path', title: 'Interactive Roadmap' };
    if (path === '/explore') return { section: 'Discovery', title: 'Explore Hub' };
    if (path === '/notifications') return { section: 'Communications', title: 'Notification Inbox' };
    if (path === '/projects') return { section: 'Hands-on Labs', title: 'Production Projects' };
    if (path === '/hackathons') return { section: 'Competitions', title: 'Hackathon Radar' };
    if (path === '/resources') return { section: 'Knowledge Base', title: 'Learning Resources' };
    if (path === '/resume' || path === '/resume-analyzer') return { section: 'AI Tools', title: 'Resume ATS Studio' };
    if (path === '/mock-interview') return { section: 'AI Tools', title: 'Mock Interview Chamber' };
    if (path === '/chatbot') return { section: 'AI Intelligence', title: 'NEXORA AI MENTOR' };
    if (path === '/about') return { section: 'Platform', title: 'About NEXORA' };
    if (path === '/profile') return { section: 'Account', title: 'Profile & Mastery' };
    if (path === '/settings') return { section: 'Account', title: 'Preferences & Settings' };
    if (path.startsWith('/resource/')) return { section: 'Resources', title: 'Resource Viewer' };
    if (path.startsWith('/task/')) return { section: 'Objectives', title: 'Task Deep Dive' };
    return { section: 'Workspace', title: 'Platform' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="nexus-shell">
      {/* ── Desktop & Tablet Sidebar (Sticky & Stationary) ── */}
      <aside className="nexus-sidebar sticky top-0 h-screen">
        <div className="sidebar-brand" onClick={() => navigate('/dashboard')}>
          <div className="brand-logo-hex skeuo-convex">
            <Sparkles size={19} className="text-primary" />
          </div>
          <div className="brand-info">
            <span className="brand-title text-gradient">NEXORA</span>
            <span className="brand-badge">PRO EDITION</span>
          </div>
        </div>

        <div className="sidebar-scroll custom-scroll">
          <div className="nav-group-label">WORKSPACE</div>
          <div className="nav-group">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nexus-nav-btn ${isActive ? 'active' : ''}`}
                  title={item.label}
                >
                  <div className="nav-icon-box">
                    <Icon size={19} />
                    {item.badge && <span className="nav-badge-dot">{item.badge}</span>}
                  </div>
                  <span className="nav-text">{item.label}</span>
                  {isActive && <div className="nav-active-pip" />}
                </button>
              );
            })}
          </div>

          <div className="nav-group-label" style={{ marginTop: '16px' }}>CAREER LABS</div>
          <div className="nav-group">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nexus-nav-btn ${isActive ? 'active' : ''}`}
                  title={item.label}
                >
                  <div className="nav-icon-box">
                    <Icon size={19} />
                  </div>
                  <span className="nav-text">{item.label}</span>
                  {isActive && <div className="nav-active-pip" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer User Pill */}
        <div className="sidebar-footer">
          <div 
            className="user-profile-pill skeuo-convex interactive"
            onClick={() => navigate('/profile')}
            title="Open Profile"
          >
            <div className="user-avatar-hex">
              {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-pill-meta">
              <span className="user-pill-name">{currentUser.firstName} {currentUser.lastName || ''}</span>
              <span className="user-pill-role text-muted">Lvl {currentUser.level || 5} · {currentUser.dreamJob?.split(' ')[0] || 'Tech'}</span>
            </div>
            <Settings size={16} className="text-muted user-pill-gear" onClick={(e) => { e.stopPropagation(); navigate('/settings'); }} />
          </div>
        </div>
      </aside>

      {/* ── Main Workstation Stage ── */}
      <div className="nexus-main-stage">
        {/* Top Header Command Bar */}
        <header className="nexus-topbar glass-panel">
          <div className="topbar-left">
            {/* Mobile hamburger toggle */}
            <button 
              className="topbar-mobile-btn md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Back button for sub-pages if desired */}
            {location.pathname !== '/dashboard' && (
              <button 
                onClick={() => navigate(-1)} 
                className="btn-back-tactile"
                title="Go back"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Dynamic Breadcrumbs */}
            <div className="breadcrumb-trail">
              <span className="breadcrumb-section text-muted">{breadcrumb.section}</span>
              <ChevronRight size={13} className="text-muted" />
              <span className="breadcrumb-current text-main font-bold">{breadcrumb.title}</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="topbar-btn btn-icon-tactile"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={17} className="text-warning" /> : <Moon size={17} className="text-primary" />}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="topbar-btn btn-icon-tactile relative"
              title="Notifications"
              aria-label="View Alerts"
            >
              <Bell size={17} />
              {unreadCount > 0 && <span className="topbar-alert-badge">{unreadCount}</span>}
            </button>

            {/* User Quick Profile Icon */}
            <div 
              className="topbar-avatar interactive"
              onClick={() => navigate('/profile')}
              title={`${currentUser.firstName} (${currentUser.dreamJob})`}
            >
              {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Mobile Slide-out Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-drawer-panel glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-drawer-header">
                <div className="flex items-center gap-xs">
                  <Sparkles size={18} className="text-primary" />
                  <span className="font-bold text-gradient">NEXORA PRO</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="btn-icon-tactile">
                  <X size={18} />
                </button>
              </div>
              <div className="mobile-drawer-links">
                {[...mainNavItems, ...secondaryNavItems].map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                      {item.badge && <span className="mobile-badge">{item.badge}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className={`nexus-content-body ${isChatbot ? 'no-padding' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Floating Bottom Dock (< 768px) ── */}
      <nav className="mobile-bottom-dock glass-panel md:hidden">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`mobile-dock-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={21} />
              <span>{item.label}</span>
              {item.badge && <span className="dock-badge-dot" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
