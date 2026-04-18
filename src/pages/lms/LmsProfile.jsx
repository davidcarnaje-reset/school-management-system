import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, MessageSquare, Settings, 
  Bell, Shield, Moon, ChevronRight, Send, Search, Edit3
} from 'lucide-react';

const LmsProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'settings'

  // MOCK DATA PARA SA CHAT
  const recentChats = [
    { id: 1, name: 'Jackie Sun', role: 'Math Teacher', message: 'Don\'t forget your graphing assignment.', time: '2h ago', unread: 1, avatarBg: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'Nymia Dela Cruz', role: 'Science Teacher', message: 'Great job on the lab experiment!', time: 'Yesterday', unread: 0, avatarBg: 'bg-emerald-100 text-emerald-600' },
    { id: 3, name: 'Class 10-A Group', role: 'Class GC', message: 'Mark: Sino may kopya ng PDF?', time: 'Tue', unread: 5, avatarBg: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 pb-10">
      
      {/* 1. HEADER / BANNER */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
         {/* Background Decors */}
         <div className="absolute -left-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
         
         <div className="flex items-center gap-6 relative z-10 w-full">
            <div className="relative group">
               <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/50 shadow-2xl flex items-center justify-center text-white font-black text-4xl overflow-hidden">
                  {user?.first_name?.charAt(0) || 'S'}
               </div>
               <button className="absolute bottom-0 right-0 p-2 bg-indigo-900 text-white rounded-full shadow-lg hover:bg-white hover:text-indigo-900 transition-colors">
                  <Edit3 size={16} />
               </button>
            </div>
            <div>
               <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 border border-white/10">
                  Student Account
               </span>
               <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  {user?.first_name} {user?.last_name}
               </h1>
               <p className="font-bold text-white/80 mt-1">Student ID: {user?.student_number || '2026-0001'}</p>
            </div>
         </div>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: Profile Details */}
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                  <User size={20} className="text-indigo-500" /> Personal Info
               </h3>
               
               <div className="space-y-5">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={18} /></div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</p>
                        <p className="text-sm font-bold text-slate-700">{user?.email || 'student@school.edu.ph'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={18} /></div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</p>
                        <p className="text-sm font-bold text-slate-700">{user?.phone || '+63 912 345 6789'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={18} /></div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Address</p>
                        <p className="text-sm font-bold text-slate-700">{user?.address || 'Obando, Bulacan'}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: Chat & Settings */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* WIDGET 1: QUICK CHAT / MESSAGES */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                     <MessageSquare size={20} className="text-blue-500" /> Messages
                  </h3>
                  <div className="flex bg-white rounded-full px-3 py-1.5 shadow-sm border border-slate-200 focus-within:ring-2 ring-blue-100 transition-all">
                     <Search size={14} className="text-slate-400 mt-0.5" />
                     <input type="text" placeholder="Search chats..." className="bg-transparent border-none outline-none text-xs ml-2 w-24 md:w-32 font-bold text-slate-600" />
                  </div>
               </div>
               
               <div className="flex-1 overflow-y-auto p-2">
                  {recentChats.map(chat => (
                     <div key={chat.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${chat.avatarBg}`}>
                              {chat.name.charAt(0)}
                           </div>
                           <div>
                              <h4 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{chat.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 mb-1">{chat.role}</p>
                              <p className={`text-xs w-48 md:w-64 truncate ${chat.unread > 0 ? 'font-black text-slate-700' : 'font-bold text-slate-500'}`}>
                                 {chat.message}
                              </p>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-[10px] font-bold text-slate-400">{chat.time}</span>
                           {chat.unread > 0 && (
                              <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                 {chat.unread}
                              </span>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-2 w-full">
                     Open Full Chat Portal <ChevronRight size={16} />
                  </button>
               </div>
            </div>

            {/* WIDGET 2: ACCOUNT SETTINGS */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-slate-600" /> Account Settings
               </h3>
               
               <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors"><Bell size={18} /></div>
                        <div className="text-left">
                           <h4 className="text-sm font-black text-slate-800">Notifications</h4>
                           <p className="text-[10px] font-bold text-slate-400">Manage email & push alerts</p>
                        </div>
                     </div>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors"><Shield size={18} /></div>
                        <div className="text-left">
                           <h4 className="text-sm font-black text-slate-800">Password & Security</h4>
                           <p className="text-[10px] font-bold text-slate-400">Update password and 2FA</p>
                        </div>
                     </div>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
                  </button>

                  <div className="w-full flex items-center justify-between p-4 rounded-2xl transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500"><Moon size={18} /></div>
                        <div className="text-left">
                           <h4 className="text-sm font-black text-slate-800">Dark Mode</h4>
                           <p className="text-[10px] font-bold text-slate-400">Toggle dark theme</p>
                        </div>
                     </div>
                     {/* Toggle Switch UI */}
                     <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer hover:bg-slate-300 transition-colors">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-1 top-1"></div>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default LmsProfile;