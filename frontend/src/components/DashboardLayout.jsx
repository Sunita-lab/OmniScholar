import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardList, User, LogOut, Menu, ChevronLeft } from 'lucide-react';
import ConstellationBackground from './ConstellationBackground';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: ClipboardList, label: 'Assignments', path: '/assignments' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-[280px]'
        } bg-secondary border-r border-white/10 relative transition-all duration-200 flex flex-col`}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <ConstellationBackground />
        </div>

        <div className="relative z-10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
  <img src="/logo.png" alt="OmniScholar" className="w-14 h-14" />
  {!collapsed &&(<h1 className="text-xl font-bold" >
    <span className="text-primary">Omni</span>
      <span className="text-white">Scholar</span>
  </h1>)}
</div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="relative z-10 flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-secondary border-b border-white/10 flex items-center justify-between px-6">
          <h2 className="text-white font-semibold capitalize">{user?.role} Dashboard</h2>
          <div className="flex items-center gap-3">
            <span className="text-slate-300 text-sm">{user?.fullName}</span>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-background rounded-tl-[24px] p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}