import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import {
  X,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Send,
  MessageSquare,
  History,
} from 'lucide-react';

export const JobDetailModal = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNote,
}) => {
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  if (!isOpen || !job) return null;

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      await onAddNote(job._id, newNote.trim());
      setNewNote('');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleRunAI = () => {
    onClose();
    navigate('/ai-analysis', {
      state: {
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        jobOpportunityId: job._id,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {job.company}
              </span>
              <StatusBadge status={job.status} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  {job.salary}
                </span>
              )}
              {job.jobLink && (
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Original Job Post
                </a>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-brand-50/60 border border-brand-100 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Update Stage:</span>
              <select
                value={job.status}
                onChange={(e) => onStatusChange(job._id, e.target.value)}
                className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-brand-200 bg-white text-slate-800 shadow-xs cursor-pointer focus:outline-none"
              >
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunAI}
                className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Analyze with AI
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(job);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors border border-slate-200 bg-white"
                title="Edit Opportunity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onClose();
                  onDelete(job._id);
                }}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 bg-white"
                title="Delete Opportunity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Dates Timeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Application Date
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {job.applicationDate
                  ? new Date(job.applicationDate).toLocaleDateString()
                  : 'Not yet applied'}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Next Follow-Up
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {job.followUpDate
                  ? new Date(job.followUpDate).toLocaleDateString()
                  : 'None scheduled'}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Interview Date
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {job.interviewDate
                  ? new Date(job.interviewDate).toLocaleDateString()
                  : 'None scheduled'}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Role & Requirements Description
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
              {job.description}
            </div>
          </div>

          {/* Personal Notes & History Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Notes & Activity History
              </h4>
            </div>

            {/* Note form */}
            <form onSubmit={handleAddNoteSubmit} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a call, interview feedback, or reminder..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                disabled={submittingNote || !newNote.trim()}
                className="px-3.5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                Log Note
              </button>
            </form>

            {/* History list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {job.notesHistory && job.notesHistory.length > 0 ? (
                job.notesHistory
                  .slice()
                  .reverse()
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>{new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700">{item.note}</p>
                    </div>
                  ))
              ) : job.notes ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  {job.notes}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No notes logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
