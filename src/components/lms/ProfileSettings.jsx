// src/components/lms/ProfileSettings.jsx
import React, { useState } from 'react';

const ProfileSettings = () => {
  // State for toggles
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isKiddieMode, setIsKiddieMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [themeColor, setThemeColor] = useState('#4F46E5'); // Default Indigo
  
  // State for About Modal
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleLogout = () => {
    // Implement your logout logic here (clear tokens, redirect)
    console.log("User logged out");
    alert("Logging out...");
  };

  // Helper component for a modern Toggle Switch
  const ToggleSwitch = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700 font-medium">{label}</span>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
        <p className="text-sm text-gray-500">Customize your LMS experience and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
        
        {/* UI Preferences */}
        <div className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Appearance & Interface</h3>
          
          <ToggleSwitch label="Dark Mode" enabled={isDarkMode} setEnabled={setIsDarkMode} />
          <ToggleSwitch label="Kiddie Dashboard Mode" enabled={isKiddieMode} setEnabled={setIsKiddieMode} />
          
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-700 font-medium">Theme Color</span>
            <div className="flex space-x-2">
              {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
          <ToggleSwitch label="Email notifications for new activities" enabled={emailNotifications} setEnabled={setEmailNotifications} />
        </div>

        {/* System Actions */}
        <div className="p-6 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            About SMS System
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors ml-auto"
          >
            Logout Account
          </button>
        </div>
      </div>

      {/* About Modal Pop Up */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-2">School Management System (SMS)</h3>
            <p className="text-sm text-gray-500 mb-4">Version 2.0.0</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Developed to centralize academic, financial, and administrative operations.</p>
              <p>Features integrated LMS, Registrar, and Cashiering modules.</p>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileSettings;