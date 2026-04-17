import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MonitorPlay, UserCircle } from 'lucide-react';

const LmsLayout = () => {
  const { user, branding } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      
      {/* LMS TOP NAVIGATION (Dark Mode para "Focus / Theater Mode" vibe) */}
      <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-[100] shadow-md">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          
          {/* Left: Exit to Portal Button */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
            >
              <ArrowLeft size={16} /> Exit LMS
            </button>
            
            <div className="hidden md:flex items-center gap-3 border-l border-slate-800 pl-6">
              <MonitorPlay className="text-indigo-500" size={24} />
              <div>
                <h1 className="font-black text-white text-lg tracking-tight leading-none">{branding?.school_name}</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Digital Classroom</p>
              </div>
            </div>
          </div>

          {/* Right: Student Mini Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-white">{user?.full_name || 'Student'}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Portal</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              <UserCircle size={24} />
            </div>
          </div>

        </div>
      </nav>

      {/* LMS MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {/* Dito automatic na papasok yung mga pages na nasa loob ng lms folder */}
        <Outlet />
      </main>

    </div>
  );
};

export default LmsLayout;