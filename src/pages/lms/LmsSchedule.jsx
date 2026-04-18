import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Import the components we just created
import KidsSchedule from '../../components/lms/KidsSchedule';
import StandardSchedule from '../../components/lms/StandardSchedule';

const LmsSchedule = () => {
  const { user } = useAuth();
  
  // MOCK DATA: Isang source of truth lang para sa data
  const scheduleToday = [
    { code: 'MATH', subject: 'General Mathematics', startTime: '08:00 AM', endTime: '09:30 AM', teacher: 'Jackie Sun', room: 'Room 101', color: 'bg-blue-500' },
    { code: 'SCI', subject: 'Earth Science', startTime: '10:00 AM', endTime: '11:30 AM', teacher: 'Nymia Dela Cruz', room: 'Lab 2', color: 'bg-emerald-500' },
    { code: 'ECON', subject: 'Applied Economics', startTime: '01:00 PM', endTime: '02:30 PM', teacher: 'Gerald Anderson', room: 'Online Zoom', color: 'bg-orange-500' },
  ];

  // THEME SELECTOR LOGIC
  const gradeLevelStr = user?.grade_level || 'Grade 10'; 
  const gradeLevelNum = parseInt(gradeLevelStr.replace(/\D/g, '')) || 10;
  
  const isKidsView = gradeLevelNum <= 6;

  return isKidsView ? (
    <KidsSchedule scheduleData={scheduleToday} />
  ) : (
    <StandardSchedule scheduleData={scheduleToday} />
  );
};

export default LmsSchedule;