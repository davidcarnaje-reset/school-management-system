// src/components/lms/ProfilePerformance.jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data - In production, fetch this from your backend API
const overallGradesData = [
  { activity: 'Act 1', grade: 85 }, { activity: 'Act 2', grade: 90 },
  { activity: 'Act 3', grade: 78 }, { activity: 'Act 4', grade: 92 },
  { activity: 'Act 5', grade: 88 }
];

const timeSpentData = [
  { day: 'S', minutes: 30 }, { day: 'M', minutes: 120 },
  { day: 'T', minutes: 90 }, { day: 'W', minutes: 150 },
  { day: 'Th', minutes: 60 }, { day: 'F', minutes: 45 }, { day: 'St', minutes: 10 }
];

const subjectGradesData = {
  Math: [{ activity: 'Q1', grade: 80 }, { activity: 'Q2', grade: 85 }, { activity: 'Exam', grade: 90 }],
  Science: [{ activity: 'Q1', grade: 95 }, { activity: 'Q2', grade: 88 }, { activity: 'Exam', grade: 92 }],
};

const submissionData = [
  { activity: 'Act 1', onTime: 100, late: 0 },
  { activity: 'Act 2', onTime: 80, late: 20 },
  { activity: 'Act 3', onTime: 60, late: 40 },
];

const ProfilePerformance = () => {
  const [selectedSubject, setSelectedSubject] = useState('Math');

  return (
    <div className="animate-fade-in space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Academic Performance</h2>
        <p className="text-sm text-gray-500">Track your grades, activities, and system usage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Overall Grades */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">Overall Grades</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overallGradesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="activity" tick={{fontSize: 12}} />
                <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="grade" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Time you open LMS per week */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">Time you open LMS per week (Minutes)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSpentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Subject Grades with Dropdown */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">Subject Grades</h3>
            <select 
              className="px-3 py-1 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="Math">Math</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subjectGradesData[selectedSubject]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="activity" tick={{fontSize: 12}} />
                <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="grade" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Late vs On time submission */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-md font-semibold text-gray-700 mb-4 text-center">Late vs On Time Submission (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="activity" tick={{fontSize: 12}} />
                <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="onTime" stackId="a" fill="#3B82F6" name="On Time" />
                <Bar dataKey="late" stackId="a" fill="#EF4444" name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePerformance;