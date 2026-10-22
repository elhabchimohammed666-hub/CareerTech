import React from 'react';

const statusConfig = {
  Saved: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: 'Saved',
  },
  Applied: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    label: 'Applied',
  },
  Interview: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500 animate-pulse',
    label: 'Interview',
  },
  Offer: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Offer Received',
  },
  Rejected: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-400',
    label: 'Rejected',
  },
};

export const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || statusConfig.Saved;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
