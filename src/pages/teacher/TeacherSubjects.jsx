import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Clock, Layers } from 'lucide-react';
import OfflineBanner from '../../utils/offlinebanner';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, PageHeader, Card, EmptyState } from '../../components/shared/TeacherComponents';
import { SHARED_STYLES, SUBJECT_CARD_COLORS, ANIMATION_DELAYS } from '../../utils/teacherConstants';

const TeacherSubjects = () => {
  const { user, API_BASE_URL } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  /**
   * Fetch teacher's subjects/schedule from API
   */
  const fetchSubjects = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setIsRetrying(true);

    try {
      const token = localStorage.getItem('sms_token') || '';
      const response = await axios.get(`${API_BASE_URL}/teacher/get_my_schedule.php?teacher_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'success') {
        setSubjects(response.data.data || []);
        setIsServerOffline(false);
      } else {
        throw new Error(response.data.message || 'Error fetching schedule');
      }
    } catch (error) {
      console.error('Fetch subjects error:', error);
      setIsServerOffline(true);
      setSubjects([]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsRetrying(false), 800);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchSubjects();
    } else if (user) {
      setIsLoading(false);
    }
  }, [user?.id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading subjects..." />;
  }

  return (
    <div className="w-full h-full bg-transparent">
      <style>{SHARED_STYLES}</style>

      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <PageHeader
          title="My Subjects"
          subtitle="Ito ang mga subjects/lessons na itinalaga sa iyo ngayong semester."
        />

        {/* OFFLINE BANNER */}
        <div className="animate-stagger" style={{ animationDelay: ANIMATION_DELAYS.banner }}>
          <OfflineBanner
            isServerOffline={isServerOffline}
            isRetrying={isRetrying}
            onRetry={fetchSubjects}
          />
        </div>

        {/* SUBJECT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                index={index}
                isOffline={isServerOffline}
                stripeColor={SUBJECT_CARD_COLORS[index % SUBJECT_CARD_COLORS.length]}
              />
            ))
          ) : !isServerOffline ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-xl border border-white/50">
              <EmptyState
                icon={BookOpen}
                title="No Subjects Assigned"
                message="You currently have no classes assigned. Please coordinate with the Registrar for your teaching load."
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/**
 * Subject card component
 * Displays individual subject information with action buttons
 */
const SubjectCard = ({ subject, index, isOffline, stripeColor }) => (
  <Card
    className={`overflow-hidden flex shadow-sm transition-all duration-300 transform-gpu group ${
      isOffline
        ? 'opacity-70 grayscale-[0.5]'
        : 'hover:shadow-md hover:bg-white/60 hover:-translate-y-1'
    }`}
    animationDelay={ANIMATION_DELAYS.firstCard + index * ANIMATION_DELAYS.increment}
  >
    {/* Colored stripe */}
    <div className={`w-1.5 ${stripeColor}`} />

    {/* Content */}
    <div className="p-4 flex-1 flex flex-col">
      {/* Title & Units */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1 pr-2">
          {subject.subject_description}
        </h3>
        <span className="bg-white/60 border border-white text-slate-600 text-[9px] font-black px-2 py-1 rounded-md shadow-sm uppercase tracking-widest shrink-0">
          {subject.units} UNITS
        </span>
      </div>

      {/* Grade Level & Section */}
      <div className="mt-1 mb-4 flex gap-2">
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100/50 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-200/50">
          {subject.grade_level}
        </span>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100/50 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-200/50">
          SEC: {subject.section || 'TBA'}
        </span>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-2 border-t border-white/50 pt-3 mt-auto">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
          <Clock size={12} className="text-indigo-500 shrink-0" />
          <span className="truncate">{subject.schedule}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
          <Layers size={12} className="text-indigo-500 shrink-0" />
          <span>Modules</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isOffline}
        >
          View Modules
        </button>
        <button
          className="flex-1 py-1.5 bg-white/60 backdrop-blur-sm border border-white text-slate-600 rounded-lg text-[10px] font-bold hover:bg-white hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isOffline}
        >
          Lesson Plan
        </button>
      </div>
    </div>
  </Card>
);

export default TeacherSubjects;