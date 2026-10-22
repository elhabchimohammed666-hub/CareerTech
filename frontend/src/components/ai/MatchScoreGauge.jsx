import React from 'react';

export const MatchScoreGauge = ({ score = 0, category = 'Good Match', explanation = '' }) => {
  // Category styling
  const categoryStyles = {
    'Strong Match': {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      bar: 'bg-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800',
      textColor: 'text-emerald-600',
    },
    'Good Match': {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      bar: 'bg-blue-500',
      badge: 'bg-blue-100 text-blue-800',
      textColor: 'text-blue-600',
    },
    'Partial Match': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      bar: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-800',
      textColor: 'text-amber-600',
    },
    'Low Match': {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      bar: 'bg-rose-500',
      badge: 'bg-rose-100 text-rose-800',
      textColor: 'text-rose-600',
    },
  };

  const currentStyle = categoryStyles[category] || categoryStyles['Good Match'];

  return (
    <div className={`p-5 rounded-2xl border ${currentStyle.bg} transition-all`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Explainable Alignment Assessment
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h3 className={`text-2xl font-black ${currentStyle.textColor}`}>
              {category}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border border-current ${currentStyle.badge}`}
            >
              Score: {score} / 100
            </span>
          </div>
        </div>

        {/* Circular or score indicator */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200/80 flex items-center justify-center bg-white shadow-inner">
            <span className="text-xl font-black text-slate-800">{score}%</span>
          </div>
        </div>
      </div>

      {/* Progress meter */}
      <div className="w-full bg-slate-200/80 rounded-full h-3 mt-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${currentStyle.bar}`}
          style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
        ></div>
      </div>

      {/* Explanation text */}
      {explanation && (
        <p className="text-xs text-slate-600 mt-3 font-medium leading-relaxed">
          <strong className="text-slate-700">Rationale: </strong>
          {explanation}
        </p>
      )}
    </div>
  );
};

export default MatchScoreGauge;
