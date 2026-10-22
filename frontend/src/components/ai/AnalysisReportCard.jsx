import React from 'react';
import MatchScoreGauge from './MatchScoreGauge.jsx';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Lightbulb,
  Download,
  Calendar,
  FileText,
  Sparkles,
} from 'lucide-react';
import { getExportPdfUrl } from '../../api/ai.js';

export const AnalysisReportCard = ({ report, onDownload, showActions = true }) => {
  if (!report) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload(report._id);
    } else {
      window.open(getExportPdfUrl(report._id), '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-brand-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Analysis Report</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {report.jobTitle || 'Target Position'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
              {report.company && (
                <span className="font-medium bg-white/10 px-2.5 py-1 rounded-md">
                  🏢 {report.company}
                </span>
              )}
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-brand-300" />
                {report.cvOriginalName || 'Uploaded CV'} (
                {report.cvSource === 'main' ? 'Main Profile CV' : 'Custom Upload'}
                )
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(report.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {showActions && (
            <div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-sm transition-all"
                title="Download formatted PDF report"
              >
                <Download className="w-4 h-4 mr-1.5 text-brand-600" />
                Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Match Score & Explainability Component */}
        <MatchScoreGauge
          score={report.matchScore}
          category={report.matchCategory}
          explanation={report.scoreExplanation}
        />

        {/* 1. Overall Assessment */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-brand-700 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h3 className="text-lg font-bold text-slate-900">Overall Assessment</h3>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm leading-relaxed text-slate-700">
            {report.overallAssessment}
          </div>
        </section>

        {/* 2. Matching Qualifications */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Matching Qualifications ({report.matchingQualifications?.length || 0})
              </h3>
            </div>
            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Demonstrated in CV
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {report.matchingQualifications && report.matchingQualifications.length > 0 ? (
              report.matchingQualifications.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <div className="font-semibold text-slate-900 text-sm">
                        {item.requirement}
                      </div>
                      <div className="text-xs font-mono bg-white/80 p-2 rounded border border-emerald-200 text-emerald-950">
                        <strong className="text-emerald-700">CV Evidence: </strong>
                        "{item.cvEvidence}"
                      </div>
                      <p className="text-xs text-slate-600">{item.explanation}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                No direct matching qualifications were identified from the text.
              </p>
            )}
          </div>
        </section>

        {/* 3. Unconfirmed Requirements */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Unconfirmed Requirements ({report.unconfirmedRequirements?.length || 0})
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Absence does not imply inability
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {report.unconfirmedRequirements && report.unconfirmedRequirements.length > 0 ? (
              report.unconfirmedRequirements.map((item, idx) => {
                const isImplicit = item.type === 'unclear_or_implicit';
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      isImplicit
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isImplicit ? (
                        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {item.requirement}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                              isImplicit
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isImplicit ? 'Unclear / Implicit' : 'Unsupported in CV'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 italic">
                All prominent qualifications appear confirmed.
              </p>
            )}
          </div>
        </section>

        {/* 4. Relevant Experience */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Highlighted Relevant Experience
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {report.relevantExperience && report.relevantExperience.length > 0 ? (
              report.relevantExperience.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-blue-100 bg-blue-50/30"
                >
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {item.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                          {item.relevance} Relevance
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </section>

        {/* 5. Practical CV Improvement Suggestions */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              5
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Practical Suggestions to Strengthen Presentation
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-800 mb-1">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span>Grounded Advice (Real Experience Presentation)</span>
            </div>
            {report.improvementSuggestions && report.improvementSuggestions.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                {report.improvementSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        {/* Optional Tailoring Suggestions */}
        {report.tailoringSuggestions && report.tailoringSuggestions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h3 className="text-md font-bold text-slate-900">
                Section-by-Section Tailoring Recommendations
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.tailoringSuggestions.map((tailor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {tailor.section}
                  </span>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    {tailor.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AnalysisReportCard;
