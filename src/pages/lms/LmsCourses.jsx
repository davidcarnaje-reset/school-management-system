import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List as ListIcon, StretchHorizontal, PlayCircle, BookOpen, Clock, AlertCircle } from 'lucide-react';

const LmsCourses = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('detailed'); // 'card', 'detailed', 'list'

  // MOCK DATA
  const overallProgress = 68;
  const pendingTasks = 4;
  
  const subjects = [
    { id: 1, code: 'MATH', title: 'General Mathematics', teacher: 'Jackie Sun', progress: 75, color: 'bg-blue-500', nextTask: 'Chapter 1 Quiz' },
    { id: 2, code: 'SCI', title: 'Earth Science', teacher: 'Nymia Dela Cruz', progress: 40, color: 'bg-emerald-500', nextTask: 'Lab Report' },
    { id: 3, code: 'ECON', title: 'Applied Economics', teacher: 'G. Anderson', progress: 90, color: 'bg-orange-500', nextTask: 'None' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* 1. OVERALL STATS HEADER */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
         <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">My Learning Hub</h1>
            <p className="text-slate-500 font-bold text-sm mt-1">Keep up the great work!</p>
         </div>
         
         <div className="flex gap-6 w-full md:w-auto">
            {/* Progress Circular/Bar */}
            <div className="flex-1 md:w-48 bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Overall Progress</span>
                  <span className="text-sm font-black text-indigo-600">{overallProgress}%</span>
               </div>
               <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${overallProgress}%` }}></div>
               </div>
            </div>
            
            {/* Pending Activities */}
            <div className="flex-1 md:w-32 bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col justify-center items-center">
               <span className="text-3xl font-black text-red-500 leading-none">{pendingTasks}</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mt-1">Pending</span>
            </div>
         </div>
      </div>

      {/* 2. VIEW SELECTOR TOOLBAR */}
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-xl font-black text-slate-800">Enrolled Subjects</h2>
         <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button onClick={() => setViewMode('card')} className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Card View (Kids)">
               <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode('detailed')} className={`p-2 rounded-lg transition-all ${viewMode === 'detailed' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Detailed View">
               <StretchHorizontal size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="List View">
               <ListIcon size={18} />
            </button>
         </div>
      </div>

      {/* 3. DYNAMIC VIEWS */}
      
      {/* A. CARD VIEW (Pambata / Visual) */}
      {viewMode === 'card' && (
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {subjects.map(sub => (
               <div key={sub.id} onClick={() => navigate(`/lms/course/${sub.id}`)} className="bg-white p-2 rounded-[2rem] shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-300 transition-all cursor-pointer group">
                  <div className={`h-32 md:h-40 rounded-[1.5rem] ${sub.color} flex items-center justify-center mb-3 relative overflow-hidden`}>
                     <span className="text-4xl font-black text-white/30">{sub.code}</span>
                     <PlayCircle className="absolute text-white opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all drop-shadow-lg" size={48} />
                  </div>
                  <div className="p-2 text-center">
                     <h3 className="font-black text-slate-800 text-sm truncate">{sub.title}</h3>
                     <p className="text-[10px] font-bold text-slate-400 mt-1">{sub.progress}% Done</p>
                  </div>
               </div>
            ))}
         </div>
      )}

      {/* B. DETAILED VIEW (Standard Modern) */}
      {viewMode === 'detailed' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(sub => (
               <div key={sub.id} onClick={() => navigate(`/lms/course/${sub.id}`)} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                     <div className={`w-14 h-14 rounded-2xl ${sub.color} flex items-center justify-center text-white font-black shadow-md`}>{sub.code}</div>
                     <div>
                        <h3 className="font-black text-slate-800 leading-tight">{sub.title}</h3>
                        <p className="text-xs font-bold text-slate-500">{sub.teacher}</p>
                     </div>
                  </div>
                  
                  <div className="mt-auto">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion</span>
                        <span className="text-xs font-black text-slate-700">{sub.progress}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                        <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.progress}%` }}></div>
                     </div>
                     
                     <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                           <AlertCircle size={12} /> {sub.nextTask}
                        </div>
                        <span className="text-[10px] font-black uppercase text-indigo-500 group-hover:pr-2 transition-all">Enter Class &rarr;</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )}

      {/* C. LIST VIEW (Compact / Pang-matanda) */}
      {viewMode === 'list' && (
         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            {subjects.map((sub, idx) => (
               <div key={sub.id} onClick={() => navigate(`/lms/course/${sub.id}`)} className={`flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 cursor-pointer transition-colors ${idx !== subjects.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-4 w-1/3">
                     <div className={`w-10 h-10 rounded-xl ${sub.color} flex items-center justify-center text-white font-black text-[10px] hidden sm:flex`}>{sub.code}</div>
                     <div>
                        <h3 className="font-black text-slate-800 text-sm md:text-base">{sub.title}</h3>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500">{sub.teacher}</p>
                     </div>
                  </div>
                  <div className="hidden md:flex flex-col items-start w-1/4">
                     <span className="text-[10px] font-black uppercase text-slate-400 mb-1">Next Task</span>
                     <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><BookOpen size={12} className="text-orange-400"/> {sub.nextTask}</span>
                  </div>
                  <div className="flex items-center gap-4 w-1/3 md:w-1/4 justify-end">
                     <div className="w-24 hidden sm:block">
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.progress}%` }}></div>
                        </div>
                     </div>
                     <span className="text-sm font-black text-slate-700">{sub.progress}%</span>
                  </div>
               </div>
            ))}
         </div>
      )}

    </div>
  );
};

export default LmsCourses;