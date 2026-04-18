import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, User, ChevronLeft, 
  ChevronRight, AlertCircle, BookOpen, Edit3, StickyNote, Plus, X
} from 'lucide-react';

const StandardSchedule = () => {
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDay, setSelectedDay] = useState(18);
  const [reminders, setReminders] = useState({});
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState("");

  const mockMonthData = {
    15: { classes: 2, deadlines: 1, assigned: 0 },
    18: { 
      classes: [
        { code: 'MATH', subject: 'General Mathematics', startTime: '08:00 AM', endTime: '09:30 AM', teacher: 'Jackie Sun', room: 'Room 101', color: 'bg-blue-500' },
        { code: 'SCI', subject: 'Earth Science', startTime: '10:00 AM', endTime: '11:30 AM', teacher: 'Nymia Dela Cruz', room: 'Lab 2', color: 'bg-emerald-500' }
      ],
      deadlines: [{ title: 'Chapter 1 Quiz', subject: 'MATH', time: '11:59 PM' }],
      assigned: [{ title: 'Read Reaction Paper', subject: 'ECON' }]
    },
    20: {
      classes: [{ code: 'ECON', subject: 'Applied Economics', startTime: '01:00 PM', endTime: '02:30 PM', teacher: 'Gerald Anderson', room: 'Online Zoom', color: 'bg-orange-500' }],
      deadlines: [], assigned: []
    },
    24: { classes: 3, deadlines: 2, assigned: 1 }
  };

  const daysInMonth = 30;
  const startDayOfWeek = 3; 
  const calendarCells = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - startDayOfWeek + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setViewMode('timeline');
  };

  const addReminder = () => {
    if (!newReminderText.trim()) return;
    setReminders(prev => ({ ...prev, [selectedDay]: [...(prev[selectedDay] || []), newReminderText] }));
    setNewReminderText("");
    setIsReminderModalOpen(false);
  };

  if (viewMode === 'calendar') {
    return (
      <div className="animate-in zoom-in-95 fade-in duration-500">
        <div className="flex justify-between items-center mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><CalendarIcon size={20} className="md:w-6 md:h-6" /></div>
              <div>
                 <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">April 2026</h2>
                 <p className="text-[10px] md:text-xs font-bold text-slate-400">Monthly Academic Overview</p>
              </div>
           </div>
           <div className="flex gap-1 md:gap-2">
              <button className="p-2 md:p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><ChevronLeft size={18}/></button>
              <button className="p-2 md:p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><ChevronRight size={18}/></button>
           </div>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-6 px-2 justify-center md:justify-start">
           <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-500"></div> Classes</span>
           <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500"></div> Deadlines</span>
           <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-orange-500"></div> Assigned</span>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-slate-100 shadow-sm relative z-10">
           <div className="grid grid-cols-7 gap-1 md:gap-4 mb-2 md:mb-4">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
               <div key={day} className="text-center text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">{day.substring(0,1)}<span className="hidden md:inline">{day.substring(1)}</span></div>
             ))}
           </div>
           
           <div className="grid grid-cols-7 gap-1 md:gap-4">
             {calendarCells.map((day, idx) => {
               const dayData = mockMonthData[day];
               const dayReminders = reminders[day];
               const isToday = day === 18;
               const hasContent = dayData || dayReminders?.length > 0;

               return (
                 <div 
                   key={idx} 
                   onClick={() => day && handleDayClick(day)}
                   className={`
                     group relative min-h-[60px] md:min-h-[120px] rounded-xl md:rounded-2xl p-1 md:p-2 transition-all border-2 flex flex-col items-center md:items-start
                     ${day ? 'cursor-pointer hover:border-indigo-300 hover:shadow-md bg-slate-50/50 hover:bg-white hover:z-50' : 'bg-transparent border-transparent'}
                     ${isToday ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100'}
                   `}
                 >
                   {day && (
                     <>
                        <span className={`text-[10px] md:text-sm font-black ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>{day}</span>
                        
                        {/* THE CLEAN MOBILE DOTS vs DESKTOP ICONS */}
                        <div className="mt-auto md:absolute md:bottom-2 md:left-2 md:right-2 flex flex-wrap gap-1 justify-center md:justify-start w-full">
                           {(dayData?.classes?.length > 0 || dayData?.classes > 0) && (
                              <div className="w-1.5 h-1.5 md:w-6 md:h-6 rounded-full md:rounded-lg bg-blue-500 md:bg-blue-100 md:text-blue-600 flex items-center justify-center"><BookOpen size={12} className="hidden md:block"/></div>
                           )}
                           {(dayData?.deadlines?.length > 0 || dayData?.deadlines > 0) && (
                              <div className="w-1.5 h-1.5 md:w-6 md:h-6 rounded-full md:rounded-lg bg-red-500 md:bg-red-100 md:text-red-600 flex items-center justify-center"><AlertCircle size={12} className="hidden md:block"/></div>
                           )}
                           {(dayData?.assigned?.length > 0 || dayData?.assigned > 0) && (
                              <div className="w-1.5 h-1.5 md:w-6 md:h-6 rounded-full md:rounded-lg bg-orange-500 md:bg-orange-100 md:text-orange-600 flex items-center justify-center"><Edit3 size={12} className="hidden md:block"/></div>
                           )}
                           {dayReminders?.length > 0 && (
                              <div className="w-1.5 h-1.5 md:w-6 md:h-6 rounded-full md:rounded-lg bg-purple-500 md:bg-purple-100 md:text-purple-600 flex items-center justify-center"><StickyNote size={12} className="hidden md:block"/></div>
                           )}
                        </div>

                        {/* HOVER TOOLTIP (Desktop Only) */}
                        {hasContent && (
                           <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none transform scale-95 group-hover:scale-100 z-[150] border border-slate-700">
                              <p className="text-xs font-black text-indigo-300 border-b border-slate-700 pb-2 mb-2">April {day}, 2026</p>
                              <div className="space-y-2">
                                 {dayData?.classes && <div className="flex justify-between items-center text-[10px]"><span className="text-slate-300 flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Classes:</span> <span className="font-bold">{dayData.classes.length || dayData.classes}</span></div>}
                                 {dayData?.deadlines && <div className="flex justify-between items-center text-[10px]"><span className="text-slate-300 flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Deadlines:</span> <span className="font-bold text-red-400">{dayData.deadlines.length || dayData.deadlines}</span></div>}
                                 {dayData?.assigned && <div className="flex justify-between items-center text-[10px]"><span className="text-slate-300 flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Assigned:</span> <span className="font-bold text-orange-400">{dayData.assigned.length || dayData.assigned}</span></div>}
                                 {dayReminders?.length > 0 && <div className="flex justify-between items-center text-[10px]"><span className="text-slate-300 flex items-center gap-1.5"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Notes:</span> <span className="font-bold text-purple-400">{dayReminders.length}</span></div>}
                              </div>
                           </div>
                        )}
                     </>
                   )}
                 </div>
               )
             })}
           </div>
        </div>
      </div>
    );
  }

  // THE ZOOMED IN TIMELINE
  const currentData = mockMonthData[selectedDay] || { classes: [], deadlines: [], assigned: [] };
  const currentReminders = reminders[selectedDay] || [];

  return (
    <div className="animate-in zoom-in-105 fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <button onClick={() => setViewMode('calendar')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-3">
              <ChevronLeft size={16} /> Back to Calendar
            </button>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">April {selectedDay}, 2026</h2>
         </div>
         <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-indigo-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> {selectedDay === 18 ? 'Today' : 'Selected Date'}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* TIMELINE */}
         <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2"><BookOpen className="text-indigo-500" size={20} /> Class Schedule</h3>
            {currentData.classes?.length > 0 ? (
               <div className="relative">
                  <div className="absolute left-10 md:left-[4.5rem] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                  <div className="space-y-8 relative z-10">
                     {currentData.classes.map((sched, idx) => (
                       <div key={idx} className="flex gap-4 md:gap-8 group">
                          <div className="flex flex-col items-center w-16 md:w-24 shrink-0">
                             <span className="text-xs font-black text-slate-800">{sched.startTime}</span>
                             <span className="text-[10px] font-bold text-slate-400">{sched.endTime}</span>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm mt-1 shrink-0 group-hover:scale-125 transition-transform"></div>
                          <div className="flex-1 bg-slate-50 hover:bg-white p-5 md:p-6 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="text-base md:text-lg font-black text-slate-800">{sched.subject}</h3>
                                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg text-white ${sched.color}`}>{sched.code}</span>
                             </div>
                             <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><User size={14} className="text-slate-400" /> {sched.teacher}</div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><MapPin size={14} className="text-slate-400" /> {sched.room}</div>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            ) : <div className="text-center py-12 text-slate-400 font-bold text-sm">No classes scheduled.</div>}
         </div>

         {/* TASKS */}
         <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl text-white">
               <h3 className="text-lg font-black text-white/90 mb-6 flex items-center gap-2"><AlertCircle className="text-red-400" size={18} /> Due & Assigned</h3>
               <div className="space-y-4">
                  {currentData.deadlines?.map((task, i) => (
                     <div key={i} className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-400 bg-red-500/20 px-2 py-1 rounded mb-2 inline-block">Deadline</span>
                        <h4 className="font-bold text-sm text-white mb-1">{task.title}</h4>
                        <p className="text-[10px] text-white/60">{task.subject} • Due {task.time}</p>
                     </div>
                  ))}
                  {currentData.assigned?.map((task, i) => (
                     <div key={i} className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                        <span className="text-[8px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/20 px-2 py-1 rounded mb-2 inline-block">New Activity</span>
                        <h4 className="font-bold text-sm text-white mb-1">{task.title}</h4>
                        <p className="text-[10px] text-white/60">{task.subject}</p>
                     </div>
                  ))}
                  {(!currentData.deadlines?.length && !currentData.assigned?.length) && <p className="text-center text-xs text-white/40 font-bold py-4">No tasks for today. Relax!</p>}
               </div>
            </div>
            
            {/* NOTES */}
            <div className="bg-indigo-50 rounded-[2.5rem] p-6 md:p-8 border border-indigo-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2"><StickyNote className="text-indigo-500" size={18} /> My Notes</h3>
                  <button onClick={() => setIsReminderModalOpen(true)} className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"><Plus size={16} /></button>
               </div>
               <div className="space-y-3">
                  {currentReminders.map((note, idx) => (
                     <div key={idx} className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-50 flex items-start gap-3 text-sm font-bold text-slate-700">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0"></div><p>{note}</p>
                     </div>
                  ))}
                  {currentReminders.length === 0 && <p className="text-center text-xs text-indigo-300 font-bold py-2">No custom notes for this day.</p>}
               </div>
            </div>
         </div>
      </div>

      {isReminderModalOpen && (
         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-90 duration-200">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-slate-800">Add Quick Note</h3>
                  <button onClick={() => setIsReminderModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
               </div>
               <textarea value={newReminderText} onChange={(e) => setNewReminderText(e.target.value)} placeholder="E.g., Bring graphing calculator..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 mb-4 min-h-[100px] resize-none"></textarea>
               <button onClick={addReminder} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors">Save Note</button>
            </div>
         </div>
      )}
    </div>
  );
};

export default StandardSchedule;