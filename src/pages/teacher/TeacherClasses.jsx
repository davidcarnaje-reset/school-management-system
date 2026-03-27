import React, { useState, useEffect, useCallback } from 'react';
import { Users, BookOpen, ChevronRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import OfflineBanner from '../../utils/offlinebanner';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, PageHeader, EmptyState } from '../../components/shared/TeacherComponents';
import { SHARED_STYLES, ANIMATION_DELAYS } from '../../utils/teacherConstants';

const TeacherClasses = () => {
  const { user, API_BASE_URL } = useAuth();
  const [sections, setSections] = useState([]);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  /**
   * Fetch sections with error handling and offline fallback
   */
  const fetchSections = useCallback(async () => {
    if (!user?.id) return;

    setIsRetrying(true);
    try {
      const token = localStorage.getItem('sms_token') || '';
      const response = await axios.get(`${API_BASE_URL}/teacher/get_sections.php?teacher_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'success') {
        setSections(response.data.data || []);
        setIsServerOffline(false);
      } else {
        throw new Error(response.data.message || 'API Error');
      }
    } catch (error) {
      console.error('Fetch classes failed:', error);
      setIsServerOffline(true);
      setSections([
        {
          id: 0,
          subject: 'Offline Mode',
          section_name: 'Database Offline',
          level: 'System',
          student_count: 0,
          room: 'TBA',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsRetrying(false), 800);
    }
  }, [user, API_BASE_URL]);

  useEffect(() => {
    if (user?.id) fetchSections();
  }, [user?.id]);

  if (isLoading && !sections.length) {
    return <LoadingSpinner message="Loading classes..." />;
  }

  return (
    <div className="w-full flex flex-col bg-transparent pb-8 lg:pb-4">
      <style>{SHARED_STYLES}</style>

      <div className="max-w-7xl mx-auto w-full space-y-4">
        {/* HEADER */}
        <PageHeader
          title="My Sections"
          subtitle="Select a class below to view students, manage grades, and check schedules."
          badge={`${isServerOffline ? '0' : sections.length} Active Classes`}
        />

        {/* OFFLINE BANNER */}
        <OfflineBanner
          isServerOffline={isServerOffline}
          isRetrying={isRetrying}
          onRetry={fetchSections}
        />

        {/* SECTIONS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {sections.length > 0 && !isLoading ? (
            sections.map((section, index) => (
              <SectionCard
                key={section.id}
                section={section}
                index={index}
                isOffline={isServerOffline}
              />
            ))
          ) : null}

          {/* EMPTY STATE */}
          {!isLoading && sections.length === 0 && !isServerOffline && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-sm">
              <EmptyState
                icon={Users}
                title="No classes assigned"
                message="Your schedule is currently empty. Please wait for the Registrar to finish processing the teaching loads."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Extracted component for a single section card
 * Makes the grid layout cleaner and easier to maintain
 */
const SectionCard = ({ section, index, isOffline }) => (
  <div
    className={`animate-stagger bg-white/60 backdrop-blur-md border border-white rounded-2xl p-5 shadow-sm transition-all duration-300 transform-gpu group flex flex-col relative overflow-hidden ${
      isOffline
        ? 'opacity-70 pointer-events-none grayscale-[0.5]'
        : 'hover:shadow-xl hover:bg-white hover:-translate-y-1 hover:border-l-4 hover:border-l-indigo-500'
    }`}
    style={{ animationDelay: `${ANIMATION_DELAYS.firstCard + index * ANIMATION_DELAYS.increment}ms` }}
  >
    {/* Background accent */}
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50 pointer-events-none transition-opacity group-hover:opacity-100" />

    {/* Level badge */}
    <div className="flex justify-between items-start mb-3 relative z-10">
      <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100/80 text-slate-600 px-3 py-1.5 rounded-lg shadow-sm">
        {section.level || 'Unassigned'}
      </span>
    </div>

    {/* Class info */}
    <div className="mb-4 relative z-10">
      <h3 className="text-2xl font-black text-slate-800 tracking-tight line-clamp-1 mb-1.5">
        {section.section_name || 'TBA'}
      </h3>
      <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-md">
        <BookOpen size={12} className="text-indigo-600" />
        <span className="text-[11px] font-bold text-indigo-700 truncate max-w-[200px]">
          {section.subject}
        </span>
      </div>
    </div>

    {/* Details */}
    <div className="flex flex-col gap-2.5 mb-6 mt-1 relative z-10">
      <div className="flex items-center gap-2 text-slate-500">
        <div className="p-1.5 bg-slate-100 rounded-md shrink-0">
          <MapPin size={12} />
        </div>
        <span className="text-xs font-semibold">{section.room || 'Room TBA'}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <div className="p-1.5 bg-slate-100 rounded-md shrink-0">
          <Users size={12} />
        </div>
        <span className="text-xs font-semibold">{section.student_count || 0} Official Students</span>
      </div>
    </div>

    {/* Action button */}
    <div className="mt-auto pt-4 border-t border-slate-100 relative z-10">
      <Link
        to={`/teacher/sections/${section.id}`}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-xl font-bold text-xs transition-all shadow-sm group/btn"
      >
        <span>{isOffline ? 'Unavailable' : 'Manage Class'}</span>
        <ChevronRight
          size={16}
          className="text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all"
        />
      </Link>
    </div>
  </div>
);

export default TeacherClasses;