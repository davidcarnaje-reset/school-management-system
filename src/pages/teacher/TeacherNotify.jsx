import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Megaphone, Calendar, AlertCircle, Info, FileText, DollarSign, ShieldAlert } from 'lucide-react';
import OfflineBanner from '../../utils/offlinebanner';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, PageHeader, Badge, Card } from '../../components/shared/TeacherComponents';
import { SHARED_STYLES, DEPARTMENT_STYLES, PRIORITY_TYPES, ANIMATION_DELAYS } from '../../utils/teacherConstants';

const TeacherNotify = () => {
  const { API_BASE_URL } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  /**
   * Fetch announcements with caching support
   */
  const fetchAnnouncements = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setIsRetrying(true);

    const cachedAnnouncements = localStorage.getItem('sms_teacher_announcements');

    // Use cached data while fetching fresh data
    if (cachedAnnouncements) {
      try {
        setAnnouncements(JSON.parse(cachedAnnouncements));
        if (showLoading) setIsLoading(false);
      } catch (err) {
        console.warn('Cache parse error:', err);
      }
    }

    try {
      const token = localStorage.getItem('sms_token') || '';
      const response = await axios.get(`${API_BASE_URL}/teacher/get_announcements.php`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      });

      if (response.data.status === 'success') {
        const data = response.data.data || [];
        setAnnouncements(data);
        localStorage.setItem('sms_teacher_announcements', JSON.stringify(data));
        setIsServerOffline(false);
      } else {
        throw new Error(response.data.message || 'Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      setIsServerOffline(true);

      if (!cachedAnnouncements) {
        setAnnouncements([]);
      }
    } finally {
      if (showLoading) setIsLoading(false);
      setTimeout(() => setIsRetrying(false), 800);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchAnnouncements(true);
  }, [fetchAnnouncements]);

  if (isLoading) {
    return <LoadingSpinner message="Loading announcements..." />;
  }

  const iconMap = {
    FileText,
    DollarSign,
    ShieldAlert,
    Megaphone,
  };

  return (
    <div className="w-full h-full bg-transparent">
      <style>{SHARED_STYLES}</style>

      <div className="max-w-4xl mx-auto space-y-4 pb-10">
        {/* HEADER */}
        <PageHeader
          icon={<Megaphone size={20} />}
          title="Announcements"
          subtitle="Updates and memos from school administration."
        />

        {/* OFFLINE BANNER */}
        <div className="animate-stagger" style={{ animationDelay: ANIMATION_DELAYS.banner }}>
          <OfflineBanner
            isServerOffline={isServerOffline}
            isRetrying={isRetrying}
            onRetry={() => fetchAnnouncements(false)}
          />
        </div>

        {/* ANNOUNCEMENTS LIST */}
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <AnnouncementCard
                key={announcement.id || index}
                announcement={announcement}
                index={index}
                iconMap={iconMap}
              />
            ))
          ) : (
            !isServerOffline && (
              <div className="text-center py-10 bg-white/40 backdrop-blur-md rounded-xl border border-white shadow-sm">
                <p className="text-sm font-bold text-slate-500">No new announcements at this time.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Individual announcement card component
 */
const AnnouncementCard = ({ announcement, index, iconMap }) => {
  const deptStyle = DEPARTMENT_STYLES[announcement.department] || DEPARTMENT_STYLES.default;
  const DepartmentIcon = iconMap[deptStyle.icon] || Megaphone;
  const priorityStyle = PRIORITY_TYPES[announcement.type] || PRIORITY_TYPES.general;

  return (
    <Card
      className="overflow-hidden hover:bg-white/60 hover:-translate-y-0.5 transition-all duration-300 transform-gpu group"
      animationDelay={ANIMATION_DELAYS.firstCard + index * ANIMATION_DELAYS.increment}
    >
      {/* Header */}
      <div
        className={`px-5 py-2.5 flex flex-wrap justify-between items-center gap-2 border-b backdrop-blur-sm ${deptStyle.bg} ${deptStyle.border}`}
      >
        <div className="flex items-center space-x-2">
          <span
            className={`${deptStyle.color} bg-white/50 p-1.5 rounded-md border border-white/50 shadow-sm group-hover:scale-110 transition-transform duration-300`}
          >
            <DepartmentIcon size={16} />
          </span>
          <span className={`font-black uppercase tracking-widest text-[9px] ${deptStyle.color}`}>
            {announcement.department ? `${announcement.department} Dept` : 'Department (NULL)'}
          </span>
        </div>

        {/* Priority Badge */}
        <PriorityBadge type={announcement.type} style={priorityStyle} />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className={`text-base font-extrabold mb-2 leading-tight tracking-tight ${
            announcement.title ? 'text-slate-800' : 'text-slate-400 italic'
          }`}
        >
          {announcement.title || 'Title missing'}
        </h3>
        <p
          className={`text-[11px] leading-relaxed mb-4 break-words ${
            announcement.content ? 'text-slate-600' : 'text-slate-400 italic'
          }`}
        >
          {announcement.content || 'Content missing.'}
        </p>

        {/* Metadata Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[10px] text-slate-500 font-bold border-t border-white/50 pt-3">
          <div className="flex items-center">
            <Info size={12} className="mr-1.5 text-indigo-400" />
            Posted by:
            <span className={`ml-1 ${announcement.author ? 'text-slate-700' : 'text-slate-400 italic'}`}>
              {announcement.author || 'Unknown'}
            </span>
          </div>
          <div className="hidden sm:block text-slate-300">•</div>
          <div className="flex items-center">
            <Calendar size={12} className="mr-1.5 text-indigo-400" />
            <span className={announcement.date ? 'text-slate-700' : 'text-slate-400 italic'}>
              {announcement.date || 'No date'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * Priority badge component with conditional rendering
 */
const PriorityBadge = ({ type, style }) => {
  const UrgentIcon = type === 'urgent' ? AlertCircle : null;

  return (
    <span
      className={`${style.style} border border-white px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1`}
    >
      {UrgentIcon && <UrgentIcon size={10} />}
      {style.label}
    </span>
  );
};

export default TeacherNotify;