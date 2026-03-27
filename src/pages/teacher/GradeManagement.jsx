import React, { useState, useCallback, useEffect } from 'react';
import { Save, ArrowLeft, CheckCircle, Calculator } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import OfflineBanner from '../../utils/offlinebanner';
import { LoadingSpinner, Card, CardHeader, Badge } from '../../components/shared/TeacherComponents';
import { SHARED_STYLES, ANIMATION_DELAYS } from '../../utils/teacherConstants';
import {
  getTeacherLevel,
  calculateFinalGrade,
  getGradeStatus,
  getGradingCategories,
  prepareGradesPayload,
  getDummyStudentData,
} from '../../utils/gradingUtils';

const GradeManagement = () => {
  const { classId } = useParams();
  const { user, API_BASE_URL } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const teacherLevel = getTeacherLevel(user?.role);
  const categories = getGradingCategories(teacherLevel);

  /**
   * Fetch grades from API with fallback to offline mode
   */
  const fetchGrades = useCallback(async (isInitialLoad = false) => {
    setIsRetrying(true);

    try {
      const token = localStorage.getItem('sms_token') || '';
      const res = await axios.get(`${API_BASE_URL}/teacher/get_class_grades.php`, {
        params: { class_id: classId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data || res.data;
      if (data) {
        setStudents(data);
        setIsServerOffline(false);
      }
    } catch (error) {
      console.error('Fetch grades error:', error);
      setIsServerOffline(true);
      setStudents(getDummyStudentData(teacherLevel));
    } finally {
      if (isInitialLoad) setIsLoading(false);
      setTimeout(() => setIsRetrying(false), 800);
    }
  }, [classId, teacherLevel, API_BASE_URL]);

  useEffect(() => {
    if (user?.id) {
      fetchGrades(true);
    } else if (user) {
      setIsLoading(false);
    }
  }, [user, fetchGrades]);

  /**
   * Update a student's grade component
   */
  const handleInputChange = (id, field, value) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === id ? { ...s, [field]: parseFloat(value) || 0 } : s
      )
    );
  };

  /**
   * Save all grades to backend
   */
  const saveAllGrades = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('sms_token') || '';
      const payload = prepareGradesPayload(students, classId, teacherLevel);

      const res = await axios.post(`${API_BASE_URL}/teacher/save_grades.php`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.data.status === 'success') {
        setStatusMsg({ type: 'success', text: 'Grades synced to database!' });
      } else {
        throw new Error(res.data.message || 'Failed to save grades');
      }
    } catch (err) {
      console.error('Save grades error:', err);
      setStatusMsg({ type: 'error', text: 'Connection failed. Check network.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading Gradebook..." />;
  }

  return (
    <div className="w-full h-full bg-transparent">
      <style>{SHARED_STYLES}</style>

      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <div
          className="animate-stagger flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/40 backdrop-blur-md px-5 py-4 rounded-xl border border-white shadow-sm"
          style={{ animationDelay: ANIMATION_DELAYS.header }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/60 hover:bg-white rounded-lg border border-white shadow-sm transition-colors text-slate-600"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Manage Grades</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  text={`${teacherLevel} System`}
                  variant="info"
                />
                <span className="text-[10px] text-slate-600 font-bold uppercase">Class: {classId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/60 text-slate-600 border border-white rounded-lg font-bold text-[11px] hover:bg-white shadow-sm transition-all">
              <Calculator size={14} /> Tools
            </button>
            <button
              onClick={saveAllGrades}
              disabled={isSaving || isServerOffline}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[11px] hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition-all"
            >
              {isSaving ? 'Saving...' : <><Save size={14} /> Save</>}
            </button>
          </div>
        </div>

        {/* OFFLINE BANNER */}
        <OfflineBanner
          isServerOffline={isServerOffline}
          isRetrying={isRetrying}
          onRetry={() => fetchGrades(false)}
        />

        {/* STATUS MESSAGE */}
        {statusMsg && (
          <div
            className={`animate-stagger p-3 px-4 rounded-xl border flex items-center gap-2.5 shadow-sm backdrop-blur-md transition-all ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700'
                : 'bg-red-50/80 border-red-200 text-red-700'
            }`}
            style={{ animationDelay: `${ANIMATION_DELAYS.banner}ms` }}
          >
            <CheckCircle size={16} />
            <span className="text-[11px] font-bold">{statusMsg.text}</span>
          </div>
        )}

        {/* GRADES TABLE */}
        <Card className="overflow-hidden flex flex-col" animationDelay={ANIMATION_DELAYS.firstCard}>
          <div className="overflow-x-auto p-1">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="text-slate-500 text-[9px] font-black uppercase tracking-widest border-b border-white/50 bg-white/20">
                  <th className="px-5 py-3 rounded-tl-lg">Student</th>
                  {categories.map(cat => (
                    <th key={cat.key} className="px-3 py-3 text-center">
                      {cat.label} ({cat.percentage})
                    </th>
                  ))}
                  <th className="px-5 py-3 text-center">Final</th>
                  <th className="px-5 py-3 text-center rounded-tr-lg">Remarks</th>
                </tr>
              </thead>
              <tbody className="text-slate-800 text-xs">
                {students.map((student, index) => {
                  const final = calculateFinalGrade(student, teacherLevel);
                  const status = getGradeStatus(final, teacherLevel);

                  return (
                    <tr
                      key={student.id}
                      className="animate-stagger hover:bg-white/50 transition-colors border-b border-white/30 last:border-0 group"
                      style={{ animationDelay: `${ANIMATION_DELAYS.firstCard + index * ANIMATION_DELAYS.increment}ms` }}
                    >
                      {/* Student Name */}
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold text-[10px] border border-white shadow-sm group-hover:scale-105 transition-transform">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800">{student.name}</span>
                        </div>
                      </td>

                      {/* Grade Input Fields */}
                      {categories.map(cat => (
                        <td key={cat.key} className="px-3 py-2.5">
                          <input
                            type="number"
                            step={cat.key.includes('college') ? '0.25' : '1'}
                            min="0"
                            max={teacherLevel === 'K12' ? 100 : 4}
                            value={student[cat.key] || 0}
                            onChange={e => handleInputChange(student.id, cat.key, e.target.value)}
                            className="w-14 mx-auto block p-1.5 bg-white/50 backdrop-blur-sm border border-white rounded-md text-center font-bold text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm hover:bg-white/80"
                          />
                        </td>
                      ))}

                      {/* Final Grade */}
                      <td className="px-5 py-2.5 text-center font-black text-sm text-slate-800 drop-shadow-sm">
                        {final}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-2.5 text-center">
                        <Badge
                          text={status}
                          variant={status === 'Passed' ? 'success' : 'error'}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GradeManagement;