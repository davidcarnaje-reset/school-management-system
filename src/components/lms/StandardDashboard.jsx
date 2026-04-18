import React from 'react';
import { Bookmark, PlayCircle, Clock, CheckCircle, ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';

const StandardDashboard = ({ courses, nextLessons }) => {
  return (
    <div className="animate-in fade-in duration-700">
      
      {/* COURSES SECTION */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <LayoutGrid className="text-indigo-600" /> My Enrolled Courses
           </h2>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-md">All courses</button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className={`${course.color} p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group transition-transform hover:-translate-y-1 cursor-pointer`}>
               <div className="absolute top-8 right-8 text-white/50 group-hover:text-white transition-colors">
                  <Bookmark size={24} />
               </div>
               <span className="inline-block px-3 py-1 bg-black/20 text-white rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-sm mb-4">
                  {course.tag}
               </span>
               <h3 className="text-2xl font-black text-white leading-tight mb-10 max-w-[85%]">{course.title}</h3>
               
               <div className="mt-auto">
                  <div className="flex justify-between text-xs font-bold mb-2">
                     <span className={course.textColor}>Progress</span>
                     <span className="text-white">{course.progress}/{course.total} lessons</span>
                  </div>
                  <div className="w-full h-2 bg-black/20 rounded-full mb-6 overflow-hidden">
                     <div className="h-full bg-white rounded-full transition-all duration-1000 relative" style={{ width: `${(course.progress / course.total) * 100}%` }}>
                        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full blur-[2px]"></div>
                     </div>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-black/20 flex items-center justify-center text-[10px] text-white font-bold backdrop-blur-sm">+15</div>
                     </div>
                     <button className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg ${course.buttonColor}`}>
                        Continue <PlayCircle size={16} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* TASKS & PROMO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
               <h3 className="text-xl font-black text-slate-800">Upcoming Tasks & Lessons</h3>
            </div>
            <div className="space-y-2">
               {nextLessons.map((lesson, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-[1.2rem] flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <CheckCircle size={20} />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-800 text-sm">{lesson.title}</h4>
                          <p className="text-[11px] font-bold text-slate-500 mt-0.5">{lesson.desc}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-12 text-sm font-bold">
                       <div className="hidden sm:flex items-center gap-2 text-slate-600">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px]">{lesson.teacher.charAt(0)}</div>
                          {lesson.teacher}
                       </div>
                       <div className="flex items-center gap-1.5 text-slate-500 w-20">
                          <Clock size={14} /> {lesson.duration}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#a3e635] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <Sparkles size={100} />
            </div>
            <div>
               <p className="text-slate-800 font-bold text-sm mb-4">Achievement Unlocked!</p>
               <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">Top 10%</span>
               <h3 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">You are performing excellently in Mathematics!</h3>
            </div>
            <button className="w-full py-4 mt-6 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-colors flex justify-center items-center gap-2">
               View Ranking <ArrowRight size={16} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default StandardDashboard;