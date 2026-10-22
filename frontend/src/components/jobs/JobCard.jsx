import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Sparkles,
  Edit2,
  Trash2,
  Clock,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

export const JobCard = ({
  job,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
}) => {
  const navigate = useNavigate();

  const handleRunAI = (e) => {
    e.stopPropagation();
    navigate('/ai-analysis', {
      state: {
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        jobOpportunityId: job._id,
      },
    });
  };

  const isInterviewSoon =
    job.interviewDate && new Date(job.interviewDate) >= new Date();
  const isFollowUpSoon =
    job.followUpDate && new Date(job.followUpDate) >= new Date();

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(job)}
      className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-brand-300 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Company & Status changer */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
              {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                {job.company}
              </span>
            </div>
          </div>

          {/* Quick status dropdown */}
          <div onClick={(e) => e.stopPropagation()}>
            <select
              value={job.status}
              onChange={(e) => onStatusChange && onStatusChange(job._id, e.target.value)}
              className="text-xs font-semibold py-1 px-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1">
          {job.title}
        </h3>

        {/* Location & Salary */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-2">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
          )}
          {job.salary && (
            <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
              {job.salary}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Badges for upcoming interview or follow-up */}
        {(isInterviewSoon || isFollowUpSoon) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {isInterviewSoon && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3 text-amber-600" />
                Interview: {new Date(job.interviewDate).toLocaleDateString()}
              </span>
            )}
            {isFollowUpSoon && !isInterviewSoon && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                <Calendar className="w-3 h-3 text-blue-600" />
                Follow-up: {new Date(job.followUpDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* Notes preview */}
        {job.notes && (
          <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 italic">{job.notes}</span>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Added {new Date(job.createdAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {job.jobLink && (
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Open job link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={handleRunAI}
            className="p-1.5 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Analyze CV against this job"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Analyze</span>
          </button>

          <button
            onClick={() => onEdit && onEdit(job)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit opportunity"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete && onDelete(job._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete opportunity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
