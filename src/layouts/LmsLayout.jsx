import React, { useState, useRef } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Home, Calendar, Bell, User, Power, BookMarked, 
  MessageSquare, Settings, Info, GraduationCap, ChevronUp, X,
  Layers, FileText, Video, CheckSquare, Award, PieChart, Users,
  Library
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LmsLayout = () => {
  const { user, branding, API_BASE_URL } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileStackOpen, setIsMobileStackOpen] = useState(false);
  const [isMobileCourseTabsOpen, setIsMobileCourseTabsOpen] = useState(false); 
  
  // SCROLL & GLASS STATE
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false); // <--- BAGONG STATE PARA SA GLASS EFFECT
  const lastScrollY = useRef(0);

  // ==========================================
  // STATIC MOCK DATA
  // ==========================================
  const navItems = [
    { id: 'dashboard', icon: <Home size={22} />, path: '/lms/dashboard' },
    { id: 'schedule', icon: <Calendar size={22} />, path: '/lms/calendar' },
    { id: 'courses', icon: <Library size={22} />, path: '/lms/courses' },
    { id: 'profile', icon: <User size={22} />, path: '/lms/profile' },
  ];

  const mySubjects = [
    { id: 1, code: 'MATH', name: 'Gen Math', color: 'bg-blue-500' },
    { id: 2, code: 'SCI', name: 'Earth Sci', color: 'bg-emerald-500' },
    { id: 3, code: 'ECON', name: 'Applied Econ', color: 'bg-orange-500' },
  ];

  const courseTabs = [
    { id: 'all', icon: <Layers size={18} />, label: 'Stream / All' },
    { id: 'lectures', icon: <FileText size={18} />, label: 'Written Lectures' },
    { id: 'videos', icon: <Video size={18} />, label: 'Video Lectures' },
    { id: 'activities', icon: <CheckSquare size={18} />, label: 'Activities' },
    { id: 'exams', icon: <Award size={18} />, label: 'Exams' },
    { id: 'grades', icon: <PieChart size={18} />, label: 'My Grades' },
    { id: 'people', icon: <Users size={18} />, label: 'Classmates' },
  ];

  const categoryFilters = [
    { id: 'all', label: 'All Subjects', color: 'bg-slate-800' },
    { id: 'core', label: 'Core Subjects', color: 'bg-blue-500' },
    { id: 'applied', label: 'Applied', color: 'bg-orange-500' },
    { id: 'specialized', label: 'Specialized', color: 'bg-emerald-500' },
  ];

  // ==========================================
  // CONTEXT LOGIC
  // ==========================================
  const currentPath = location.pathname;
  const isHome = currentPath.includes('dashboard');
  const isProfile = currentPath.includes('profile');
  const isCoursesList = currentPath.endsWith('/courses');
  const isCourseDetail = currentPath.includes('/course/'); 
  const showSubjectsNav = !isHome && !isProfile && !isCourseDetail && !isCoursesList; 

  const currentCourseTabId = searchParams.get('tab') || 'all';
  const activeCourseTab = courseTabs.find(t => t.id === currentCourseTabId) || courseTabs[0];

  // ==========================================
  // SCROLL "LIQUID GLASS" LOGIC
  // ==========================================
  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    
    // Trigger Frosted Glass Effect if scrolled down even a bit
    setIsScrolled(currentScrollY > 20);

    // Hide/Show Dock smoothly
    if (currentScrollY > lastScrollY.current + 15) {
      setIsNavVisible(false); 
      setIsMobileStackOpen(false); 
      setIsMobileCourseTabsOpen(false); 
    } else if (currentScrollY < lastScrollY.current - 15) {
      setIsNavVisible(true); 
    }
    lastScrollY.current = currentScrollY;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden relative">
      
      {/* ========================================================
          1. DYNAMIC DESKTOP SIDE NAV (FROSTED GLASS)
          ======================================================== */}
      {!isHome && (
        <aside className={`hidden md:flex w-24 bg-white/70 backdrop-blur-2xl border-r border-white/50 flex-col items-center py-6 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-500 ease-out ${isNavVisible ? 'translate-x-0' : '-translate-x-full'}`}>
           
           {/* CONTEXT A: Subject Filter */}
           {showSubjectsNav && (
             <div className="flex flex-col gap-5 w-full px-2 mt-4">
                <p className="text-[8px] font-black uppercase text-slate-400 text-center tracking-widest mb-2">Filter</p>
                {mySubjects.map((sub) => (
                  <div key={sub.id} className="group relative flex justify-center cursor-pointer">
                     <div className={`w-12 h-12 ${sub.color} rounded-[1.2rem] text-white font-black text-[10px] shadow-md flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:rounded-xl`}>{sub.code}</div>
                     <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 shadow-xl transition-all duration-300">
                        {sub.name}
                     </span>
                  </div>
                ))}
             </div>
           )}

           {/* CONTEXT B: Category Filter */}
           {isCoursesList && (
             <div className="flex flex-col gap-5 w-full px-2 mt-4">
                <p className="text-[8px] font-black uppercase text-slate-400 text-center tracking-widest mb-2">Category</p>
                {categoryFilters.map((cat) => (
                  <div key={cat.id} className="group relative flex justify-center cursor-pointer">
                     <div className={`w-12 h-12 ${cat.color} rounded-[1.2rem] text-white shadow-md flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:rounded-xl`}><Layers size={20} /></div>
                     <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 shadow-xl transition-all duration-300">{cat.label}</span>
                  </div>
                ))}
             </div>
           )}

           {/* CONTEXT C: Classroom Tabs */}
           {isCourseDetail && (
             <div className="flex flex-col gap-4 w-full px-2 mt-4">
                <p className="text-[8px] font-black uppercase text-indigo-400 text-center tracking-widest mb-2">Classroom</p>
                {courseTabs.map((tab) => (
                  <div 
                    key={tab.id} 
                    onClick={() => navigate(`${location.pathname}?tab=${tab.id}`)}
                    className="group relative flex justify-center cursor-pointer"
                  >
                     <div className={`w-12 h-12 rounded-[1.2rem] shadow-sm flex items-center justify-center transition-all duration-500 ease-out ${currentCourseTabId === tab.id ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] text-white scale-110' : 'bg-slate-100/50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600'}`}>
                        {tab.icon}
                     </div>
                     <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 shadow-xl transition-all duration-300">{tab.label}</span>
                  </div>
                ))}
             </div>
           )}

           {/* CONTEXT D: Profile Options */}
           {isProfile && (
             <div className="flex flex-col gap-4 w-full px-2 mt-4">
                <p className="text-[8px] font-black uppercase text-slate-400 text-center tracking-widest mb-2">Options</p>
                <button className="w-12 h-12 bg-slate-100/50 rounded-[1.2rem] text-slate-600 flex items-center justify-center hover:bg-white hover:shadow-md hover:text-indigo-600 transition-all duration-300"><MessageSquare size={18} /></button>
                <button className="w-12 h-12 bg-slate-100/50 rounded-[1.2rem] text-slate-600 flex items-center justify-center hover:bg-white hover:shadow-md hover:text-indigo-600 transition-all duration-300"><Settings size={18} /></button>
                <button className="w-12 h-12 bg-slate-100/50 rounded-[1.2rem] text-slate-600 flex items-center justify-center hover:bg-white hover:shadow-md hover:text-indigo-600 transition-all duration-300"><Info size={18} /></button>
             </div>
           )}
        </aside>
      )}

      {/* ========================================================
          2. MAIN CONTENT AREA & HEADER (SCROLL GLASS EFFECT)
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
         
         {/* THE IOS 26 HEADER: Transparents on top, Frosted Glass on scroll */}
         <header className={`h-20 px-6 flex justify-between items-center sticky top-0 z-50 transition-all duration-500 ease-out ${isNavVisible ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'bg-white/60 backdrop-blur-[20px] saturate-150 border-b border-white/50 shadow-sm' : 'bg-transparent border-b-transparent'}`}>
            <div className="flex items-center gap-3">
               {branding?.school_logo && <img src={`${API_BASE_URL}/uploads/branding/${branding.school_logo}`} className="w-10 h-10 object-contain drop-shadow-sm" alt="Logo" />}
               <h2 className="font-black text-slate-800 tracking-tight hidden sm:block">LMS HUB</h2>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="p-2.5 text-slate-500 hover:text-indigo-600 transition-colors"><Bell size={20} /></button>
               <div className="relative">
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-black ring-2 ring-indigo-100 transition-all hover:scale-105"><User size={18} /></button>
                  {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-white/90 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/50 p-2 z-[110] animate-in fade-in zoom-in-95 duration-300">
                       <div className="p-3 border-b border-slate-100 mb-1"><p className="text-xs font-black text-slate-800">{user?.first_name} {user?.last_name}</p></div>
                       <button onClick={() => navigate('/student/dashboard')} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl text-xs font-black transition-colors mt-1"><Power size={16} /> EXIT LMS PORTAL</button>
                    </div>
                  )}
               </div>
            </div>
         </header>

         {/* MAIN SCROLL AREA */}
         <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-40 scroll-smooth" onScroll={handleScroll}>
            <div className="max-w-[1400px] mx-auto py-6">
               <Outlet />
            </div>
         </main>
      </div>

      {/* ========================================================
          3. "LIQUID GLASS" MOBILE DOCK (iOS 26 Style)
          ======================================================== */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-sm flex flex-col items-center transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isNavVisible ? 'translate-y-0 scale-100' : 'translate-y-[150%] scale-95 opacity-50'}`}>
        
        {/* THE LIQUID BUBBLE */}
        <div className="bg-[#0f172a]/70 backdrop-blur-[40px] saturate-[1.5] p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col border border-white/10 w-full transition-all duration-500 ease-out overflow-hidden">
           
           {/* CONTEXT A: Expanded Subject Filter Stack */}
           {isMobileStackOpen && showSubjectsNav && (
              <div className="flex flex-col p-4 bg-white/10 rounded-[2rem] mx-1 mt-1 mb-2 animate-in fade-in zoom-in-95 duration-300">
                 <div className="flex justify-between items-center mb-4 px-1">
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Select Subject Filter</p>
                    <X size={18} className="text-slate-400 cursor-pointer hover:text-white transition-colors" onClick={() => setIsMobileStackOpen(false)} />
                 </div>
                 <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
                    <button className="flex flex-col items-center gap-2 shrink-0 group">
                       <div className="w-14 h-14 bg-white/5 group-hover:bg-white/20 border border-white/10 rounded-[1.2rem] flex items-center justify-center text-white font-black text-xs shadow-sm transition-all duration-300 ease-out">ALL</div>
                       <span className="text-[9px] font-bold text-slate-400 text-center group-hover:text-white transition-colors">Reset</span>
                    </button>
                    {mySubjects.map((sub) => (
                      <button key={sub.id} className="flex flex-col items-center gap-2 shrink-0 group" onClick={() => setIsMobileStackOpen(false)}>
                        <div className={`w-14 h-14 ${sub.color} rounded-[1.2rem] flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-105 transition-all duration-300 ease-out`}>{sub.code}</div>
                        <span className="text-[9px] font-bold text-slate-400 text-center w-14 truncate group-hover:text-white transition-colors">{sub.name}</span>
                      </button>
                    ))}
                 </div>
              </div>
           )}

           {/* COMPACT TRIGGER */}
           {showSubjectsNav && !isMobileStackOpen && (
              <button 
                onClick={() => setIsMobileStackOpen(true)}
                className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/5 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest w-[96%] mx-auto mb-2 hover:bg-white/10 transition-all duration-300"
              >
                 Tap to Filter Subjects <ChevronUp size={14} />
              </button>
           )}

           {/* CONTEXT B: Category Tabs */}
           {isCoursesList && (
              <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-hide px-2 mb-2 w-full snap-x pt-1">
                 {categoryFilters.map(cat => (
                    <button key={cat.id} className={`flex items-center gap-1.5 px-5 py-2.5 ${cat.color} text-white transition-colors rounded-[1.2rem] text-[10px] font-bold whitespace-nowrap snap-center shadow-lg border border-white/20`}>
                       <Layers size={14} /> {cat.label}
                    </button>
                 ))}
              </div>
           )}

           {/* CONTEXT C: DROPDOWN STACK SELECTOR */}
           {isCourseDetail && (
              <div className="md:hidden w-full px-2 mb-2 mt-1 relative z-50">
                 {isMobileCourseTabsOpen ? (
                    <div className="flex flex-col bg-white/10 rounded-[1.5rem] border border-white/10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden shadow-2xl backdrop-blur-xl">
                       <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-black/20">
                          <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Select View</p>
                          <X size={16} className="text-slate-400 cursor-pointer hover:text-white transition-colors" onClick={() => setIsMobileCourseTabsOpen(false)} />
                       </div>
                       <div className="max-h-56 overflow-y-auto scrollbar-hide flex flex-col p-2 gap-1">
                          {courseTabs.map(tab => (
                             <button 
                               key={tab.id}
                               onClick={() => { navigate(`${location.pathname}?tab=${tab.id}`); setIsMobileCourseTabsOpen(false); }}
                               className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 ease-out ${currentCourseTabId === tab.id ? 'bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                             >
                                {tab.icon} <span className="uppercase tracking-wider">{tab.label}</span>
                             </button>
                          ))}
                       </div>
                    </div>
                 ) : (
                    <button 
                      onClick={() => setIsMobileCourseTabsOpen(true)}
                      className="flex items-center justify-between w-full px-5 py-3.5 bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 text-slate-200 rounded-[1.2rem] shadow-sm group"
                    >
                       <div className="flex items-center gap-3 text-xs font-black">
                          <span className="text-indigo-400 drop-shadow-md">{activeCourseTab.icon}</span> 
                          <span className="uppercase tracking-widest group-hover:text-white transition-colors">{activeCourseTab.label}</span>
                       </div>
                       <ChevronUp size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                 )}
              </div>
           )}

           {/* MAIN DOCK ICONS (Liquid Style) */}
           <div className="flex justify-around w-full px-2 py-1 relative">
              {navItems.map((item) => {
                 const isActive = location.pathname.includes(item.path);
                 return (
                   <button 
                     key={item.id}
                     onClick={() => navigate(item.path)}
                     className={`p-3.5 rounded-[1.2rem] transition-all duration-500 ease-out relative group flex items-center justify-center ${isActive ? 'bg-indigo-500/90 shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white scale-[1.05]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                   >
                     <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</div>
                     {/* Glowing dot underneath */}
                     {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></span>}
                   </button>
                 )
              })}
           </div>

        </div>
      </div>

    </div>
  );
};

export default LmsLayout;