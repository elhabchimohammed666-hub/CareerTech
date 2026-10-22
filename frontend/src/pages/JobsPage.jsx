import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from '../api/jobs.js';
import JobCard from '../components/jobs/JobCard.jsx';
import JobModal from '../components/jobs/JobModal.jsx';
import JobDetailModal from '../components/jobs/JobDetailModal.jsx';
import JobFilters from '../components/jobs/JobFilters.jsx';
import {
  Plus,
  Briefcase,
  LayoutGrid,
  List,
  Columns,
  Sparkles,
  Inbox,
} from 'lucide-react';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'board' | 'list'

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [sortField, sortOrder] = sortBy.split('_');
      const data = await getJobs({
        search: search.trim() || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        sortBy: sortField,
        order: sortOrder,
      });
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, statusFilter, sortBy]);

  // Compute status counts for filter badges
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const handleCreateOrUpdate = async (formData) => {
    if (editingJob) {
      await updateJob(editingJob._id, formData);
    } else {
      await createJob(formData);
    }
    await fetchJobs();
    if (selectedJobDetails && editingJob && selectedJobDetails._id === editingJob._id) {
      // Refresh detailed modal
      setSelectedJobDetails({ ...selectedJobDetails, ...formData });
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJob(jobId, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
      );
      if (selectedJobDetails && selectedJobDetails._id === jobId) {
        setSelectedJobDetails((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job opportunity?')) {
      try {
        await deleteJob(jobId);
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        if (selectedJobDetails?._id === jobId) {
          setSelectedJobDetails(null);
        }
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  const handleAddNote = async (jobId, noteText) => {
    const updated = await updateJob(jobId, { newNote: noteText });
    setSelectedJobDetails(updated.job);
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? updated.job : j))
    );
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Job Opportunities & Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize positions, monitor progression from application to interview, and attach interview notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board View"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Opportunity
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <JobFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        statusCounts={statusCounts}
      />

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Inbox className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              No Job Opportunities Found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search criteria or status filter to see other records.'
                : 'Start tracking opportunities by adding your first job posting.'}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Job Opportunity
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedJobDetails}
            />
          ))}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'].map((stage) => {
            const stageJobs = jobs.filter((j) => j.status === stage);
            return (
              <div
                key={stage}
                className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200 min-w-[260px] flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {stage}
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                    {stageJobs.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {stageJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      onViewDetails={setSelectedJobDetails}
                    />
                  ))}
                  {stageJobs.length === 0 && (
                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-[11px] text-slate-400">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdate}
        job={editingJob}
      />

      {/* Detailed Modal */}
      <JobDetailModal
        job={selectedJobDetails}
        isOpen={!!selectedJobDetails}
        onClose={() => setSelectedJobDetails(null)}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default JobsPage;
