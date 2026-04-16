import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { 
  FileText, Download, User, BookOpen, 
  CheckCircle, AlertCircle, Search, Unlock, Lock, Loader2, Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentGradesView = () => {
  const { branding, token, API_BASE_URL } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState([]);
  
  // ARCHITECT ADDITION: Filter State
  const [filterTerm, setFilterTerm] = useState('All');

  // Fetch Student Records
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setLoading(true);
    setStudentData(null);
    setGrades([]);
    setFilterTerm('All'); // I-reset ang filter tuwing may bagong search

    try {
      const res = await axios.get(`${API_BASE_URL}/registrar/get_student_records.php?student_id=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStudentData(res.data.student);
        setGrades(res.data.grades);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Error finding student.");
    }
    setLoading(false);
  };

  // Unlock Grades Logic
  const handleUnlock = async (class_id, quarter) => {
    if (!window.confirm("Are you sure you want to unlock this grade? The teacher will be able to edit it again.")) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/registrar/unlock_grades.php`, { class_id, quarter }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        alert(res.data.message);
        document.getElementById('searchForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Failed to unlock.");
    }
  };

  // ==========================================
  // 🚀 SMART FILTERING & GWA CALCULATION
  // ==========================================
  
  // 1. I-check kung may Quarter ang estudyante (SHS/JHS) o Semester (College)
  const hasQuarters = grades.some(g => g.quarter !== null);

  // 2. I-filter ang grades base sa dropdown selection
  const filteredGrades = useMemo(() => {
    return grades.filter(g => {
      if (filterTerm === 'All') return true;
      if (filterTerm === 'Semester') return g.quarter === null;
      return g.quarter == filterTerm;
    });
  }, [grades, filterTerm]);

  // 3. I-compute ang GWA base sa MGA NAKA-FILTER LANG
  const calculateGWA = () => {
    if (filteredGrades.length === 0) return '0.00';
    let totalUnits = 0;
    let totalWeighted = 0;

    filteredGrades.forEach(g => {
      if (g.is_locked == 1 && g.final_grade > 0) {
        const grade = parseFloat(g.final_grade);
        const units = parseInt(g.units);
        if (!isNaN(grade) && !isNaN(units)) {
          totalUnits += units;
          totalWeighted += (grade * units);
        }
      }
    });

    return totalUnits > 0 ? (totalWeighted / totalUnits).toFixed(2) : 'N/A';
  };

  // Print Logic
  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION (Hidden sa Print) */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Student Academic Records</h1>
            <p className="text-slate-500 font-medium italic">Search and manage official grades</p>
          </div>
        </div>
        
        <form id="searchForm" onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Enter Student ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
            />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center min-w-[100px]">
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Search"}
          </button>
        </form>
      </div>

      {studentData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: STUDENT INFO CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] print:rounded-none print:shadow-none border border-slate-100 print:border-black shadow-sm relative overflow-hidden print:p-4">
              
              <div className="absolute top-0 right-0 p-4 opacity-5 print:hidden">
                  <User size={120} />
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="hidden print:block text-center mb-6">
                  <h2 className="text-xl font-black">{branding.school_name}</h2>
                  <p className="text-xs uppercase tracking-widest font-bold mt-1">
                    {filterTerm === 'All' ? 'Official Transcript of Records (F137)' : 'Student Report Card'}
                  </p>
                </div>

                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest print:hidden">
                  Student Profile
                </span>
                
                <div>
                  <h2 className="text-xl print:text-lg font-black text-slate-800 uppercase">{studentData.name}</h2>
                  <p className="text-slate-400 print:text-black font-bold text-sm tracking-tighter">ID: {studentData.student_id}</p>
                </div>
                
                <hr className="border-slate-100 print:border-black" />
                
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 print:text-black font-bold uppercase tracking-widest">Program / Course</span>
                    <span className="text-sm font-bold text-slate-700 print:text-black">{studentData.program}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 print:text-black font-bold uppercase tracking-widest">Year Level & Sem</span>
                    <span className="text-sm font-bold text-slate-700 print:text-black">{studentData.grade_level} - {studentData.semester}</span>
                  </div>
                </div>

                <button onClick={handlePrint} className="w-full mt-6 flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg print:hidden">
                  <Download size={18} /> Print Document
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: GRADES TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] print:rounded-none border border-slate-100 print:border-black shadow-sm overflow-hidden print:shadow-none">
              
              {/* TABLE HEADER & FILTER OPTIONS */}
              <div className="p-5 border-b border-slate-100 print:border-black flex justify-between items-center bg-slate-50/50 print:bg-white print:p-2">
                  <h3 className="font-black text-slate-700 print:text-black uppercase text-xs tracking-widest flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-500 print:hidden" /> 
                      {filterTerm === 'All' ? 'All Subjects' : filterTerm === 'Semester' ? 'Semester Grades' : `Quarter ${filterTerm} Grades`}
                  </h3>
                  
                  {/* DROPDOWN FILTER (Hidden during print) */}
                  <div className="flex items-center gap-2 print:hidden">
                    <Filter size={14} className="text-slate-400" />
                    <select 
                      value={filterTerm} 
                      onChange={(e) => setFilterTerm(e.target.value)}
                      className="text-[11px] font-bold p-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-600 focus:border-blue-500 transition-all cursor-pointer shadow-sm min-w-[140px]"
                    >
                      <option value="All">🎓 All Records (F137)</option>
                      {hasQuarters ? (
                        <>
                          <option value="1">📊 1st Quarter</option>
                          <option value="2">📊 2nd Quarter</option>
                          <option value="3">📊 3rd Quarter</option>
                          <option value="4">📊 4th Quarter</option>
                        </>
                      ) : (
                        <option value="Semester">🏫 Current Semester</option>
                      )}
                    </select>
                  </div>
              </div>

              {/* TABLE DATA */}
              <table className="w-full text-left print:text-xs">
                <thead>
                  <tr className="bg-white border-b border-slate-100 print:border-black">
                    <th className="p-4 print:p-2 text-[10px] font-black text-slate-400 print:text-black uppercase pl-6 tracking-widest">Subject</th>
                    <th className="p-4 print:p-2 text-[10px] font-black text-slate-400 print:text-black uppercase text-center tracking-widest">Units</th>
                    <th className="p-4 print:p-2 text-[10px] font-black text-slate-400 print:text-black uppercase text-center tracking-widest">Final Grade</th>
                    <th className="p-4 print:p-2 text-[10px] font-black text-slate-400 print:text-black uppercase text-center tracking-widest">Remarks</th>
                    <th className="p-4 print:p-2 text-[10px] font-black text-slate-400 print:text-black uppercase text-center tracking-widest print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 print:divide-black">
                  {filteredGrades.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs border-b border-slate-100">
                        {grades.length === 0 ? "No grades recorded yet." : "No grades found for this selection."}
                      </td>
                    </tr>
                  ) : filteredGrades.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors print:border-b print:border-slate-200">
                      <td className="p-4 print:p-2 pl-6">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-slate-700 print:text-black text-sm uppercase">{g.code}</p>
                          {g.quarter && filterTerm === 'All' && (
                            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[9px] font-black uppercase tracking-widest print:border-black print:text-black">
                              Q{g.quarter}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 print:text-black font-medium">{g.description}</p>
                      </td>
                      <td className="p-4 print:p-2 text-center font-bold text-slate-600 print:text-black text-sm">{g.units}</td>
                      
                      <td className="p-4 print:p-2 text-center">
                        {g.is_locked == 1 ? (
                           <span className={`text-sm font-black ${parseFloat(g.final_grade) > 3.0 ? 'text-red-500 print:text-black' : 'text-slate-800 print:text-black'}`}>
                             {g.final_grade}
                           </span>
                        ) : (
                           <span className="text-xs font-bold text-slate-400 italic">Draft</span>
                        )}
                      </td>
                      
                      <td className="p-4 print:p-2">
                        <div className="flex justify-center">
                          {g.is_locked == 1 ? (
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 border print:border-none print:p-0 print:text-xs ${
                              g.remarks === 'Passed' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {g.remarks === 'Passed' ? <CheckCircle size={10} className="print:hidden"/> : <AlertCircle size={10} className="print:hidden"/>}
                              {g.remarks}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4 text-center print:hidden">
                        {g.is_locked == 1 ? (
                           <button 
                             onClick={() => handleUnlock(g.class_id, g.quarter)}
                             title="Unlock for revision"
                             className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all mx-auto block border border-slate-200 shadow-sm"
                           >
                             <Lock size={14} />
                           </button>
                        ) : (
                           <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                             <Unlock size={12}/> Open
                           </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/50 print:bg-white print:border-t-2 print:border-black">
                  <tr>
                      <td colSpan="2" className="p-5 print:p-3 pl-6 text-right font-black text-slate-400 print:text-black text-[10px] uppercase tracking-widest">
                        General Weighted Average (GWA):
                      </td>
                      <td className="p-5 print:p-3 text-center font-black text-blue-600 print:text-black text-lg">
                        {calculateGWA()}
                      </td>
                      <td></td>
                      <td className="print:hidden"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGradesView;