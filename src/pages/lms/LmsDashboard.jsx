import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Import natin ang mga bagong components mula sa components folder
import KidsDashboard from '../../components/lms/KidsDashboard';
import StandardDashboard from '../../components/lms/StandardDashboard';

const LmsDashboard = () => {
  const { user } = useAuth();
  
  // MOCK DATA: Ipapa-connect natin ito sa Database mamaya
  const myCourses = [
    { id: 1, title: 'General Mathematics: Functions & Graphs', tag: 'Core Subject', progress: 12, total: 24, color: 'bg-[#2563eb]', textColor: 'text-blue-100', buttonColor: 'bg-[#a3e635] text-slate-900 hover:bg-[#84cc16]' },
    { id: 2, title: 'Applied Economics in Modern Business', tag: 'Specialized', progress: 15, total: 30, color: 'bg-[#f97316]', textColor: 'text-orange-100', buttonColor: 'bg-[#a3e635] text-slate-900 hover:bg-[#84cc16]' },
    { id: 3, title: 'Earth and Life Science Explorations', tag: 'Core Subject', progress: 18, total: 22, color: 'bg-[#1e293b]', textColor: 'text-slate-300', buttonColor: 'bg-[#a3e635] text-slate-900 hover:bg-[#84cc16]' },
  ];

  const nextLessons = [
    { title: 'Introduction to Rational Functions', desc: 'Understanding asymptotes and intercepts', teacher: 'Jackie Sun', duration: '45 mins' },
    { title: 'Market Structures & Profit Maximization', desc: 'Monopoly vs Perfect Competition', teacher: 'Gerald Anderson', duration: '60 mins' },
    { title: 'Cellular Respiration Process', desc: 'How cells generate energy', teacher: 'Nymia Dela Cruz', duration: '30 mins' },
  ];

  // THEME SELECTOR LOGIC
  const gradeLevelStr = user?.grade_level || 'Grade 10'; 
  const gradeLevelNum = parseInt(gradeLevelStr.replace(/\D/g, '')) || 10;
  const isKidsView = gradeLevelNum <= 6;

  // Render the selected component
  return isKidsView ? (
    <KidsDashboard courses={myCourses} />
  ) : (
    <StandardDashboard courses={myCourses} nextLessons={nextLessons} />
  );
};

export default LmsDashboard;