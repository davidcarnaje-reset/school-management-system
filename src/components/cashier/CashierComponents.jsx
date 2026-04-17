import React from 'react';

export const StatCard = ({ title, value, icon: Icon, colorClass, subText }) => (
  <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] 
    border-2 border-slate-200 shadow-sm 
    hover:border-slate-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
    hover:-translate-y-1 transition-all duration-300 group cursor-default">
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest group-hover:text-slate-600 transition-colors">{subText}</span>
    </div>
    
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-slate-800 italic tracking-tighter transition-all group-hover:scale-105 origin-left">{value}</h3>
      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 group-hover:text-slate-700">{title}</p>
    </div>
  </div>
);

export const SectionHeader = ({ title, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-4 px-2">
    <div className="flex items-center gap-2 group">
      <div className="p-2.5 bg-slate-900 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-md">
        <Icon size={14} />
      </div>
      <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-700 italic border-b-2 border-transparent group-hover:border-slate-900 transition-all">{title}</h2>
    </div>
    {action && <div className="animate-in fade-in slide-in-from-right-4">{action}</div>}
  </div>
);