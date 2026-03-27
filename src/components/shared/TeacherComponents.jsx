import React from 'react';
import { LOADING_SPINNER } from '../../utils/teacherConstants';

/**
 * Reusable LoadingSpinner component
 * Eliminates duplicate loading UI code across all teacher components
 * 
 * @param {string} message - Custom loading message (optional)
 */
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className={LOADING_SPINNER.containerClass}>
    <div className={LOADING_SPINNER.spinnerWrapperClass}>
      <div className={LOADING_SPINNER.spinnerClass} />
      <div className={LOADING_SPINNER.textClass}>{message}</div>
    </div>
  </div>
);

/**
 * Reusable EmptyState component
 * Used when there are no items to display
 * 
 * @param {React.ReactNode} icon - Icon component to display
 * @param {string} title - Empty state title
 * @param {string} message - Empty state description
 */
export const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="py-12 flex flex-col items-center justify-center text-slate-500 opacity-60">
    {Icon && <Icon size={36} className="mb-3 text-slate-400" />}
    <h3 className="text-sm font-bold text-slate-600">{title}</h3>
    {message && <p className="text-xs font-medium text-slate-500 mt-1 text-center max-w-sm">{message}</p>}
  </div>
);

/**
 * Reusable Header component for each page section
 * Maintains consistent styling and layout across pages
 * 
 * @param {React.ReactNode} icon - Optional icon to display
 * @param {string} title - Page title
 * @param {string} subtitle - Optional subtitle/description
 * @param {React.ReactNode} action - Optional action button/element
 * @param {string} badge - Optional badge text (e.g., "SY 2024-2025")
 */
export const PageHeader = ({ icon: Icon, title, subtitle, action, badge }) => (
  <div className="animate-stagger flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/40 backdrop-blur-md px-5 py-4 rounded-xl border border-white shadow-sm" style={{ animationDelay: '0ms' }}>
    <div className="flex items-center gap-3 flex-1">
      {Icon && <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-500/20">{Icon}</div>}
      <div className="flex-1">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">{title}</h2>
        {subtitle && <p className="text-[11px] text-slate-600 font-medium mt-1.5">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 flex-wrap sm:flex-nowrap">
      {badge && (
        <span className="text-[11px] font-bold text-slate-700 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-white/80 shrink-0">
          {badge}
        </span>
      )}
      {action}
    </div>
  </div>
);

/**
 * Reusable StatCard component
 * Used in dashboard for displaying key metrics
 * 
 * @param {React.ReactNode} icon - Icon component
 * @param {string} label - Stat label
 * @param {string|number} value - Stat value
 * @param {string} color - Color class for icon
 * @param {string} bg - Background color class
 * @param {number} animationDelay - Stagger animation delay in ms
 * @param {boolean} isHighlight - Whether to highlight the value in red (e.g., pending grades)
 */
export const StatCard = ({ icon: Icon, label, value, color, bg, animationDelay = 0, isHighlight = false }) => (
  <div 
    className="animate-stagger bg-white/40 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white flex items-center gap-3 group cursor-default" 
    style={{ animationDelay: `${animationDelay}ms` }}
  >
    <div className={`p-2.5 rounded-lg ${bg} ${color} shrink-0 shadow-inner border border-white/50 group-hover:scale-105 transition-transform duration-300 transform-gpu`}>
      {Icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 truncate">{label}</p>
      <p className={`text-xl font-black tracking-tight truncate ${isHighlight && value > 0 ? 'text-red-600' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  </div>
);

/**
 * Reusable Card wrapper for consistent styling
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional Tailwind classes
 * @param {number} animationDelay - Stagger animation delay in ms
 */
export const Card = ({ children, className = '', animationDelay = 0 }) => (
  <div 
    className={`animate-stagger bg-white/40 backdrop-blur-md rounded-xl shadow-sm border border-white ${className}`}
    style={{ animationDelay: `${animationDelay}ms` }}
  >
    {children}
  </div>
);

/**
 * Reusable CardHeader for section headers within cards
 * 
 * @param {string} title - Header title
 * @param {React.ReactNode} icon - Optional icon
 * @param {React.ReactNode} action - Optional action button/badge on the right
 */
export const CardHeader = ({ title, icon: Icon, action }) => (
  <div className="px-5 py-3.5 border-b border-white/60 bg-white/20 flex items-center justify-between shrink-0">
    <div className="flex items-center space-x-2">
      {Icon && <Icon className="w-4 h-4 text-indigo-600" />}
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </div>
    {action}
  </div>
);

/**
 * Reusable Badge component
 * Used for status indicators, tags, etc.
 * 
 * @param {string} text - Badge text
 * @param {string} variant - Badge style variant ('success', 'error', 'warning', 'info', 'default')
 * @param {React.ReactNode} icon - Optional icon
 */
export const Badge = ({ text, variant = 'default', icon: Icon }) => {
  const variants = {
    success: 'bg-emerald-100/60 text-emerald-700 border-white',
    error: 'bg-red-100/60 text-red-700 border-white',
    warning: 'bg-amber-100/80 text-amber-700 border-white',
    info: 'bg-blue-100/80 text-blue-700 border-white',
    default: 'bg-white/60 text-slate-500 border-white',
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm border flex items-center gap-1 ${variants[variant]}`}>
      {Icon && <Icon size={12} />}
      {text}
    </span>
  );
};

/**
 * Reusable InfoItem for displaying key-value pairs
 * 
 * @param {React.ReactNode} icon - Icon component
 * @param {string} label - Label text
 * @param {string} value - Value to display
 * @param {boolean} isMissing - Whether the value is missing (shows italic placeholder)
 */
export const InfoItem = ({ icon: Icon, label, value, isMissing = false }) => (
  <div className="flex items-start gap-3">
    <div className="p-1.5 bg-indigo-100/50 rounded-md text-indigo-500 shrink-0">
      {Icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-xs font-bold ${isMissing ? 'text-slate-400 italic' : 'text-slate-800'}`}>
        {value || 'Not provided'}
      </p>
    </div>
  </div>
);

export default {
  LoadingSpinner,
  EmptyState,
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  Badge,
  InfoItem,
};