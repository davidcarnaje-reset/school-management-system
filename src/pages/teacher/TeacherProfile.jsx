import React, { useState, useCallback, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, BookOpen, Clock, Award, Edit } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import OfflineBanner from '../../utils/offlinebanner';
import { LoadingSpinner, PageHeader, InfoItem, Card, CardHeader, EmptyState } from '../../components/shared/TeacherComponents';
import { SHARED_STYLES, ANIMATION_DELAYS } from '../../utils/teacherConstants';

const TeacherProfile = () => {
  const { user, API_BASE_URL } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetch teacher profile data with caching and fallback
   */
  const fetchTeacherData = useCallback(async (showLoading = true) => {
    if (!user?.id) return;

    if (showLoading) setIsLoading(true);
    setIsRetrying(true);

    try {
      const token = localStorage.getItem('sms_token') || '';
      const response = await axios.get(`${API_BASE_URL}/teacher/profile.php`, {
        params: { id: user.id },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 3000,
      });

      if (response.data.status === 'success') {
        const dbData = response.data.data;
        const nameParts = dbData.full_name?.split(' ') || user?.full_name?.split(' ') || ['Teacher', ''];

        setTeacher({
          ...dbData,
          id: dbData.id || user?.id,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          profile_image: dbData.profile_image || user?.profile_image,
          role: dbData.role || user?.role || 'Teacher',
          subjects: dbData.subjects || [],
        });
        setIsServerOffline(false);
      } else {
        throw new Error('No profile data found');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setIsServerOffline(true);

      const nameParts = user?.full_name?.split(' ') || ['Teacher', ''];
      setTeacher({
        id: user?.id,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        profile_image: user?.profile_image,
        role: user?.role || 'Teacher',
        subjects: [],
      });
    } finally {
      if (showLoading) setIsLoading(false);
      setTimeout(() => setIsRetrying(false), 800);
    }
  }, [user?.id, API_BASE_URL, user?.full_name, user?.role, user?.profile_image]);

  useEffect(() => {
    if (user?.id) fetchTeacherData(true);
  }, [user?.id, fetchTeacherData]);

  if (isLoading) {
    return <LoadingSpinner message="Loading profile data..." />;
  }

  if (!teacher) return null;

  return (
    <div className="w-full flex flex-col bg-transparent pb-10 lg:pb-6 relative">
      <style>{SHARED_STYLES}</style>

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
        {/* HEADER & OFFLINE BANNER */}
        <div className="flex flex-col gap-3 shrink-0 animate-stagger" style={{ animationDelay: ANIMATION_DELAYS.header }}>
          <PageHeader
            title="Your Profile"
            subtitle="View and manage your professional information."
            action={
              <Link
                to="/teacher/profile/edit"
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-500/20 transition-all w-full sm:w-auto justify-center"
              >
                <Edit size={14} /> Edit Profile
              </Link>
            }
          />

          {isServerOffline && (
            <OfflineBanner
              isServerOffline={isServerOffline}
              isRetrying={isRetrying}
              onRetry={() => fetchTeacherData(false)}
            />
          )}
        </div>

        {/* PROFILE HEADER CARD */}
        <ProfileHeaderCard teacher={teacher} API_BASE_URL={API_BASE_URL} />

        {/* CONTACT & TEACHING LOAD SECTIONS */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 items-start">
          <ContactInfoCard teacher={teacher} />
          <TeachingLoadCard teacher={teacher} />
        </div>
      </div>
    </div>
  );
};

/**
 * Profile header with avatar and basic info
 */
const ProfileHeaderCard = ({ teacher, API_BASE_URL }) => (
  <Card className="shrink-0 p-5 sm:p-6" animationDelay={ANIMATION_DELAYS.firstCard}>
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      {/* Avatar */}
      <div className="relative border-4 border-white/80 rounded-[1.25rem] bg-white/50 backdrop-blur-sm shadow-sm shrink-0">
        {teacher?.profile_image ? (
          <img
            src={`${API_BASE_URL}/uploads/profiles/${teacher.profile_image}`}
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-100/80 rounded-xl flex items-center justify-center text-indigo-600 text-4xl font-extrabold uppercase">
            {teacher?.firstName?.charAt(0) || ''}
            {teacher?.lastName?.charAt(0) || ''}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 w-full flex flex-col sm:flex-row sm:justify-between items-center gap-4 sm:gap-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight capitalize tracking-tight">
            {teacher.firstName} {teacher.lastName}
          </h1>
          <p className="text-slate-600 font-bold mt-1.5 flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider">
            <Briefcase size={14} className="text-indigo-500" />
            <span>{teacher.role}</span>
            <span className="text-slate-600 mx-0.5">•</span>
            <span>{teacher.department || 'Academic Dept'}</span>
          </p>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center justify-center sm:flex-col sm:items-end gap-2">
          <span
            className={`px-3 py-1.5 border rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm ${
              teacher.status === 'Active'
                ? 'bg-emerald-100/60 text-emerald-700 border-white'
                : 'bg-white/60 text-slate-500 border-white'
            }`}
          >
            {teacher.status || 'Active'}
          </span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider bg-white/60 px-2.5 py-1 rounded-md border border-white shadow-sm">
            EMP ID: {teacher.id}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

/**
 * Contact information card
 */
const ContactInfoCard = ({ teacher }) => (
  <Card className="lg:col-span-1 w-full flex flex-col" animationDelay={ANIMATION_DELAYS.firstCard + ANIMATION_DELAYS.increment * 2}>
    <CardHeader title="Contact Info" icon={User} />
    <div className="p-5 space-y-4">
      <InfoItem
        icon={<Mail size={14} />}
        label="Email"
        value={teacher.email}
        isMissing={!teacher.email}
      />
      <InfoItem
        icon={<Phone size={14} />}
        label="Phone"
        value={teacher.phone}
        isMissing={!teacher.phone}
      />
      <div className="pt-4 border-t border-white/50">
        <InfoItem
          icon={<Award size={14} />}
          label="Date Hired"
          value={teacher.dateHired}
          isMissing={!teacher.dateHired}
        />
      </div>
    </div>
  </Card>
);

/**
 * Teaching load / subjects card
 */
const TeachingLoadCard = ({ teacher }) => (
  <Card className="lg:col-span-2 w-full flex flex-col" animationDelay={ANIMATION_DELAYS.firstCard + ANIMATION_DELAYS.increment * 3}>
    <CardHeader
      title="Teaching Load"
      icon={BookOpen}
      action={
        <span className="text-[10px] font-black uppercase tracking-widest bg-white/60 text-slate-600 px-2.5 py-1 rounded-md border border-white shadow-sm">
          {teacher.subjects?.length || 0} Subjects
        </span>
      }
    />
    <div className="p-4 space-y-3">
      {teacher.subjects && teacher.subjects.length > 0 ? (
        teacher.subjects.map(subject => (
          <SubjectItem key={subject.id} subject={subject} />
        ))
      ) : (
        <div className="py-12">
          <EmptyState
            icon={BookOpen}
            title="No subjects assigned"
            message=""
          />
        </div>
      )}
    </div>
  </Card>
);

/**
 * Single subject item in the teaching load list
 */
const SubjectItem = ({ subject }) => (
  <div className="p-3.5 rounded-xl border border-white bg-white/50 hover:bg-white/80 transition-all duration-300 shadow-sm group">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <span className="text-[10px] font-black text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded-md border border-white uppercase tracking-widest">
          {subject.code}
        </span>
        <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors mt-1">
          {subject.name}
        </h4>
        <p className="text-[11px] text-slate-600 font-medium mt-0.5 flex items-center gap-1.5">
          <User size={12} className="text-indigo-400" />
          {subject.section || 'TBA'}
        </p>
      </div>
      <div className="sm:text-right">
        <p className="text-[11px] font-bold text-slate-500 flex items-center sm:justify-end gap-1.5 bg-white/60 px-2.5 py-1.5 rounded-md border border-white shadow-sm">
          <Clock size={14} className="text-indigo-500" />
          {subject.schedule}
        </p>
      </div>
    </div>
  </div>
);

export default TeacherProfile;