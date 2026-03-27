import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, AlertCircle, Zap, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getActiveSchoolYear } from '../../utils/dateUtils';
import OfflineBanner from '../../utils/offlinebanner';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, StatCard, PageHeader } from '../../components/shared/TeacherComponents';
import { SHARED_STYLES, STAT_CARD_COLORS, ANIMATION_DELAYS } from '../../utils/teacherConstants';

const TeacherDashboard = () => {
  const { syStart, syEnd, semester } = getActiveSchoolYear();
  const { user, API_BASE_URL } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    nextSchedule: '--',
    pendingGrading: 0,
  });
  const [schedules, setSchedules] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  /**
   * Fetch dashboard data including stats and schedules
   */
  const fetchDashboardData = async () => {
    if (!user?.id) return;

    setIsRetrying(true);

    try {
      const token = localStorage.getItem('sms_token') || '';
      const response = await axios.get(`${API_BASE_URL}/teacher/get_sections.php?teacher_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      });

      if (response.data.status === 'success') {
        const data = response.data.data || [];
        setSchedules(data);

        const totalStudents = data.reduce((sum, cls) => sum + (parseInt(cls.student_count) || 0), 0);
        const nextSched = data.length > 0 ? data[0].schedule : '--';

        setStats({
          classes: data.length,
          students: totalStudents,
          nextSchedule: nextSched,
          pendingGrading: 0,
        });

        setIsServerOffline(false);
      } else {
        throw new Error(response.data.message || 'API error');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setIsServerOffline(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsRetrying(false), 800);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    } else if (user) {
      setIsLoading(false);
    }
  }, [user?.id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="w-full flex flex-col bg-transparent lg:h-[calc(100vh-7rem)] lg:-mt-4 lg:overflow-hidden pb-6 lg:pb-0 relative">
      <style>{SHARED_STYLES}</style>

      {/* Class Details Modal */}
      {selectedClass && <ClassDetailsModal class={selectedClass} onClose={() => setSelectedClass(null)} navigate={navigate} />}

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-4 lg:h-full">
        {/* Header & Offline Banner Section */}
        <div className="flex flex-col gap-3 shrink-0 animate-stagger" style={{ animationDelay: ANIMATION_DELAYS.header }}>
          <PageHeader
            title="Overview"
            subtitle={`Welcome back, ${user?.full_name || 'Teacher'}!`}
            badge={`SY ${syStart}-${syEnd} | ${semester}`}
          />

          {isServerOffline && (
            <OfflineBanner
              isServerOffline={isServerOffline}
              isRetrying={isRetrying}
              onRetry={fetchDashboardData}
            />
          )}
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 shrink-0">
          <StatCard
            icon={<BookOpen size={18} />}
            label="My Classes"
            value={stats.classes}
            color={STAT_CARD_COLORS.classes.color}
            bg={STAT_CARD_COLORS.classes.bg}
            animationDelay={ANIMATION_DELAYS.firstCard}
          />
          <StatCard
            icon={<Users size={18} />}
            label="Total Students"
            value={stats.students}
            color={STAT_CARD_COLORS.students.color}
            bg={STAT_CARD_COLORS.students.bg}
            animationDelay={ANIMATION_DELAYS.firstCard + ANIMATION_DELAYS.increment}
          />
          <StatCard
            icon={<Clock size={18} />}
            label="Next Class"
            value={stats.nextSchedule}
            color={STAT_CARD_COLORS.schedule.color}
            bg={STAT_CARD_COLORS.schedule.bg}
            animationDelay={ANIMATION_DELAYS.firstCard + ANIMATION_DELAYS.increment * 2}
          />
          <StatCard
            icon={<AlertCircle size={18} />}
            label="Pending Grades"
            value={stats.pendingGrading}
            color={STAT_CARD_COLORS.grading.color}
            bg={STAT_CARD_COLORS.grading.bg}
            animationDelay={ANIMATION_DELAYS.firstCard + ANIMATION_DELAYS.increment * 3}
            isHighlight={true}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-3 md:gap-4 lg:min-h-0 overflow-hidden">
          {/* Assigned Classes Section */}
          <div
            className="animate-stagger lg:col-span-2 bg-white/40 backdrop-blur-md rounded-xl shadow-sm border border-white flex flex-col min-h-[400px] lg:min-h-0 lg:h-full overflow-hidden"
            style={{ animationDelay: ANIMATION_DELAYS.firstCard + 250 }}
          >
            <ClassesHeader totalClasses={schedules.length} />
            <ClassesTable schedules={schedules} onSelectClass={setSelectedClass} />
          </div>

          {/* Tasks & Reminders Section */}
          <div
            className="animate-stagger lg:col-span-1 bg-white/40 backdrop-blur-md border border-white shadow-sm rounded-xl flex flex-col min-h-[350px] lg:min-h-0 lg:h-full overflow-hidden"
            style={{ animationDelay: ANIMATION_DELAYS.firstCard + 300 }}
          >
            <ReminderSection />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Header component for classes section
 */
const ClassesHeader = ({ totalClasses }) => (
  <div className="px-5 py-3.5 border-b border-white/60 bg-white/20 flex items-center justify-between shrink-0">
    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4 text-indigo-600" />
      <h3 className="text-sm font-bold text-slate-800">Your Assigned Classes</h3>
    </div>
    <span className="text-[9px] font-bold bg-white/60 text-slate-700 px-2.5 py-1 rounded-md border border-white uppercase">
      {totalClasses} Classes
    </span>
  </div>
);

/**
 * Table header for desktop view
 */
const TableHeader = () => (
  <div className="px-5 py-2.5 bg-white/40 border-b border-white/60 shrink-0 hidden md:block">
    <div className="grid grid-cols-12 gap-2 text-slate-500 text-[9px] font-black uppercase tracking-widest">
      <div className="col-span-4">Subject & Section</div>
      <div className="col-span-4">Schedule</div>
      <div className="col-span-2">Students</div>
      <div className="col-span-2 text-right">Action</div>
    </div>
  </div>
);

/**
 * Classes table with schedule information
 */
const ClassesTable = ({ schedules, onSelectClass }) => (
  <>
    <TableHeader />
    <div className="flex-1 overflow-y-auto custom-scroll p-2">
      <div className="flex flex-col space-y-1">
        {schedules.length > 0 ? (
          schedules.map(sched => (
            <ClassRow key={sched.id} schedule={sched} onSelect={onSelectClass} />
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 h-full opacity-60">
            <BookOpen size={30} className="mb-2" />
            <p className="text-xs font-semibold">No classes assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  </>
);

/**
 * Single class row in the table
 */
const ClassRow = ({ schedule, onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center px-3 py-3 hover:bg-white/50 transition-colors border-b border-white/30 last:border-0 group rounded-lg">
    <div className="md:col-span-4 pr-2">
      <div className="font-bold text-slate-800 text-[12px] truncate">{schedule.subject}</div>
      <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">
        {schedule.level} - {schedule.section_name || 'TBA'}
      </div>
    </div>
    <div className="md:col-span-4 text-slate-600 text-[10px] font-semibold flex items-center gap-1.5 mt-1 md:mt-0">
      <Clock size={10} className="text-indigo-500" />
      <span className="truncate">{schedule.schedule}</span>
    </div>
    <div className="md:col-span-2 flex items-center gap-1.5">
      <Users size={12} className="text-slate-400" />
      <span className="text-[11px] font-bold text-slate-700">{schedule.student_count || 0}</span>
    </div>
    <div className="md:col-span-2 text-right">
      <button
        onClick={() => onSelect(schedule)}
        className="text-indigo-600 hover:text-indigo-800 font-bold text-[9px] uppercase tracking-wider bg-white/50 px-3 py-1.5 rounded-md border border-white/80 shadow-sm transition-all"
      >
        View
      </button>
    </div>
  </div>
);

/**
 * Tasks and reminders section
 */
const ReminderSection = () => (
  <>
    <div className="px-4 py-3.5 border-b border-white/60 bg-white/20">
      <h3 className="text-sm font-bold text-slate-800">Tasks & Reminders</h3>
    </div>
    <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2">
      <div className="flex items-start gap-2.5 p-2.5 bg-white/50 rounded-lg border border-white shadow-sm hover:bg-white/80 transition-all duration-300 cursor-pointer group">
        <div className="p-1.5 bg-orange-100/80 rounded-md text-orange-500 group-hover:scale-110">
          <Zap size={14} />
        </div>
        <div className="mt-0.5">
          <p className="text-[11px] text-slate-800 font-bold leading-tight">Prepare Syllabus</p>
          <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Due Today</p>
        </div>
      </div>
    </div>
  </>
);

/**
 * Class details modal
 */
const ClassDetailsModal = ({ class: selectedClass, onClose, navigate }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform-gpu scale-100">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <BookOpen size={18} />
          </div>
          <h3 className="font-bold text-slate-800">Class Details</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</p>
          <p className="text-base font-bold text-slate-800">{selectedClass.subject}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Section</p>
            <p className="text-sm font-bold text-slate-800">{selectedClass.section_name || 'TBA'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Students</p>
            <p className="text-sm font-bold text-slate-800">{selectedClass.student_count || 0}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
        >
          Close
        </button>
        <button
          onClick={() => navigate(`/teacher/grades/${selectedClass.id}`)}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
        >
          Manage Grades <ChevronRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

export default TeacherDashboard;