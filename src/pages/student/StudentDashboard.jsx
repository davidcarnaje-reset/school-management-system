import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, BookOpen, CreditCard, Lock, Unlock, 
  LogOut, GraduationCap, Calendar as CalendarIcon, 
  CheckCircle2, Bell, Megaphone, Info, Download, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Para sa Mobile Responsiveness
  
  const API_BASE_URL = "http://localhost/sms-api"; 

  const [branding, setBranding] = useState({
    school_name: 'School Portal',
    theme_color: '#001f3f',
    school_logo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandRes = await axios.get(`${API_BASE_URL}/branding.php`);
        if (brandRes.data) setBranding(brandRes.data);

        const studentRes = await axios.get(`${API_BASE_URL}/get_students.php`);
        const myData = studentRes.data.find(s => s.email === user.email);
        if (myData) setStudentData(myData);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchData();
  }, [user.email]);

  const isLocked = !studentData || studentData.enrollment_status === 'Pending';

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 font-black animate-pulse text-slate-400 uppercase tracking-widest">
      Initializing Portal...
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* --- SIDEBAR (Responsive) --- */}
      <aside 
        style={{ backgroundColor: branding.theme_color }} 
        className={`fixed inset-y-0 left-0 z-50 w-72 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r-4 border-yellow-500 shadow-2xl shrink-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* LOGO SECTION */}
        <div className="p-8 text-center border-b border-white/5 relative">
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 text-white/50"><X size={20}/></button>
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-yellow-500 shadow-xl">
            {branding.school_logo ? (
              <img src={`${API_BASE_URL}/${branding.school_logo}`} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-800 font-black text-xl italic">CSPB</span>
            )}
          </div>
          <h2 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 leading-tight">{branding.school_name}</h2>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <SidebarBtn icon={<User size={18}/>} label="Dashboard" active />
          <SidebarBtn 
            icon={isLocked ? <Lock size={18}/> : <BookOpen size={18}/>} 
            label="LMS Classroom" 
            onClick={() => !isLocked && navigate('/lms')}
            disabled={isLocked}
          />
          <SidebarBtn icon={<CreditCard size={18}/>} label="Accounting" onClick={() => navigate('/accounting')} />
        </nav>

        {/* LOGOUT */}
        <div className="p-6 border-t border-white/5">
          <button onClick={logout} className="w-full p-4 bg-white/5 text-white/60 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3">
            <LogOut size={16} /> Logout System
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto relative">
        
        {/* TOP NAVBAR (Dito nakalagay ang Profile Pic sa Upper Right) */}
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center lg:justify-end">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 bg-slate-100 rounded-xl"><Menu size={20}/></button>
          
          <div className="flex items-center gap-4">
            <div className="p-2.5 text-slate-400 hover:text-blue-600 cursor-pointer relative"><Bell size={20}/><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></div>
            
            {/* PROFILE PICTURE UPPER RIGHT */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-none mb-1">{studentData?.first_name} {studentData?.last_name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{studentData?.student_id}</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-yellow-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform overflow-hidden bg-slate-100">
                {studentData?.profile_image ? (
                  <img src={`${API_BASE_URL}/uploads/profiles/${studentData.profile_image}`} className="w-full h-full rounded-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-yellow-500">
                    {studentData?.first_name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-6 md:p-12">
          
          {/* HEADER: BADGES & GREETING */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                {studentData?.grade_level || 'Grade 12'}
              </span>
              <span className="bg-yellow-500 text-[#001f3f] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                {studentData?.enrollment_type || 'Continuing'}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${studentData?.enrollment_status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {studentData?.enrollment_status || 'Pending'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Mabuhay, <span style={{ color: branding.theme_color }}>{studentData?.first_name}!</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic underline underline-offset-4 decoration-yellow-500">
               Official Student Dashboard
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* ANNOUNCEMENT */}
              <div style={{ backgroundColor: branding.theme_color }} className="text-white p-5 rounded-3xl flex items-center gap-5 shadow-xl overflow-hidden">
                <Megaphone size={24} className="shrink-0 animate-bounce" />
                <marquee className="font-black text-xs uppercase tracking-widest italic">
                   Welcome to CSPB Portal. Please settle your accounts and verify your documents to maintain LMS Access.
                </marquee>
              </div>

              {/* ENROLLMENT DETAILS TABLE */}
              <section className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Info size={100} /></div>
                <h3 className="font-black text-slate-800 mb-8 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                   <CheckCircle2 size={16} className="text-blue-500"/> Personal & Enrollment Records
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                   <InfoItem label="Grade Level" value={studentData?.grade_level} />
                   <InfoItem label="Classification" value={studentData?.enrollment_type} />
                   <InfoItem label="School Year" value={studentData?.school_year} />
                   <InfoItem label="Portal Access" value={studentData?.enrollment_status} />
                   <InfoItem label="Payment Plan" value={studentData?.payment_plan} />
                   <InfoItem label="LRN Number" value={studentData?.lrn} />
                </div>
              </section>
            </div>

            {/* RIGHT SIDE CARDS */}
            <div className="space-y-8">
               <div className={`p-8 rounded-[2.5rem] border-4 transition-all ${isLocked ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Portal Verification</p>
                 <div className="flex items-center gap-4">
                    <div className={`${isLocked ? 'bg-red-500' : 'bg-emerald-500'} text-white p-4 rounded-2xl shadow-lg`}>
                       {isLocked ? <Lock size={24}/> : <Unlock size={24}/>}
                    </div>
                    <div>
                       <p className={`font-black text-xl leading-none ${isLocked ? 'text-red-700' : 'text-emerald-700'}`}>
                          {isLocked ? 'LOCKED' : 'ACTIVE'}
                       </p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">LMS Access Code</p>
                    </div>
                 </div>
               </div>

               <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
                 <h3 className="font-black text-[9px] uppercase tracking-widest mb-6 text-slate-500 italic underline">Downloads</h3>
                 <div className="space-y-3">
                    <DownloadBtn label="Class Schedule" />
                    <DownloadBtn label="Student Handbook" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Overlay para sa Mobile Sidebar */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"></div>}
    </div>
  );
};

// MINI COMPONENTS
const SidebarBtn = ({ icon, label, active, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-yellow-500 text-[#001f3f] shadow-lg' : disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-slate-300'}`}>
    {icon} {label}
  </button>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-black text-slate-800">{value || '---'}</p>
  </div>
);

const DownloadBtn = ({ label }) => (
  <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest">
     {label} <Download size={14} className="text-yellow-500" />
  </button>
);

export default StudentDashboard;