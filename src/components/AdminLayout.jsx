import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Map, BookOpen, BarChart2, LogOut } from 'lucide-react';
import './Layout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/students', icon: <Users size={20} />, label: 'Students' },
    { path: '/admin/paths', icon: <Map size={20} />, label: 'Career Paths' },
    { path: '/admin/resources', icon: <BookOpen size={20} />, label: 'Resources' },
    { path: '/admin/reports', icon: <BarChart2 size={20} />, label: 'Reports' },
  ];

  return (
    <div className="flex" style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)' }}>
      {/* Side Navigation for Desktop */}
      <aside className="glass-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', padding: 'var(--space-lg)', borderRadius: 0, borderRight: '1px solid var(--border-color)', borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
        <div className="mb-xl text-center">
          <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800' }}>NEXORA Admin</h2>
        </div>
        
        <nav className="flex flex-col gap-sm flex-1">
          {menuItems.map(item => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                background: location.pathname === item.path ? 'var(--primary)' : 'transparent',
                color: location.pathname === item.path ? 'white' : 'var(--text-muted)',
                fontWeight: location.pathname === item.path ? '600' : '500',
                transition: 'all 0.3s ease'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => navigate('/admin/login')}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', color: 'var(--secondary)', fontWeight: '600' }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-xl)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
