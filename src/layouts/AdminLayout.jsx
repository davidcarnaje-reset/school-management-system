import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Menu, X } from 'lucide-react'; // Dagdag: Menu, X
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State para sa Mobile Menu

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'User Management', path: '/admin/users' },
    { icon: <Settings size={20} />, label: 'Branding Engine', path: '/admin/branding' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      
      {/* 1. MOBILE OVERLAY (Lilitaw lang kapag bukas ang sidebar sa mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="p-6 text-2xl font-bold border-b border-slate-800 text-blue-400 flex justify-between items-center">
          <span>SMS Admin</span>
          {/* Close button para sa mobile */}
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path} 
              onClick={() => setIsSidebarOpen(false)} // Close sidebar pag nag-click ng link sa mobile
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-900/30 text-red-400 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center space-x-4">
            {/* Hamburger Button (Lilitaw lang sa Mobile) */}
            <button 
              className="p-2 rounded-lg hover:bg-slate-100 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-slate-700 font-medium text-sm lg:text-lg truncate">System Administration</h2>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            <span className="hidden md:block text-sm text-slate-500 italic">Welcome, {user?.full_name}</span>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm lg:text-base">
              {user?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;