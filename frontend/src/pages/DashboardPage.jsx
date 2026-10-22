import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getJobStats, updateJob } from '../api/jobs.js';
import { getAnalysisHistory } from '../api/ai.js';
import StatCard from '../components/common/StatCard.jsx';
import StatusBadge from '../components/jobs/StatusBadge.jsx';
import {
  Briefcase,
  Send,
  CalendarCheck,
  Award,
  Sparkles,
  FileText,
  Plus,
  ArrowRight,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, historyData] = await Promise.all([
        getJobStats(),
        getAnalysisHistory(),
      ]);
      setStats(statsData.stats);
      setRecentAnalyses(historyData.history.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJob(jobId, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const statusCounts = stats?.statusCounts || {
    Saved: 0,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-brand-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-brand-300 text-xs font-bold uppercase tracking-wider">
            Personal Career Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-sm text-indigo-100 mt-2 leading-relaxed">
            Monitor your job application pipelines, track upcoming interviews, and optimize your CV with grounded AI feedback.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/ai-analysis"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-brand-900 hover:bg-brand-50 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-brand-600" />
              New AI CV Analysis
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-700/80 hover:bg-brand-700 text-white border border-brand-500/30 transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Opportunity
            </Link>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saved & Tracking"
          value={stats?.totalOpportunities || 0}
          icon={Briefcase}
          color="slate"
          subtitle="Opportunities recorded"
        />
        <StatCard
          title="Applications Sent"
          value={stats?.totalApplied || 0}
          icon={Send}
          color="blue"
          subtitle={`${stats?.applicationsThisMonth || 0} this month`}
        />
        <StatCard
          title="Interviews"
          value={statusCounts.Interview || 0}
          icon={CalendarCheck}
          color="amber"
          subtitle="Active interview stage"
        />
        <StatCard
          title="Offers Received"
          value={statusCounts.Offer || 0}
          icon={Award}
          color="emerald"
          subtitle="Job offers received"
        />
      </div>

      {/* Main Grid: Pipeline Breakdown & CV Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Pipeline Overview & Recent Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Pipeline Progress bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Application Pipeline Distribution
              </h3>
              <Link
                to="/jobs"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all ({stats?.totalOpportunities || 0})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Visual stacked bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              {stats?.totalOpportunities > 0 ? (
                <>
                  <div
                    style={{
                      width: `${((statusCounts.Saved || 0) / stats.totalOpportunities) * 100}%`,
                    }}
                    className="bg-slate-400 h-full"
                    title={`Saved: ${statusCounts.Saved}`}
                  />
                  <div
                    style={{
                      width: `${((statusCounts.Applied || 0) / stats.totalOpportunities) * 100}%`,
                    }}
                    className="bg-blue-500 h-full"
                    title={`Applied: ${statusCounts.Applied}`}
                  />
                  <div
                    style={{
                      width: `${((statusCounts.Interview || 0) / stats.totalOpportunities) * 100}%`,
                    }}
                    className="bg-amber-500 h-full"
                    title={`Interview: ${statusCounts.Interview}`}
                  />
                  <div
                    style={{
                      width: `${((statusCounts.Offer || 0) / stats.totalOpportunities) * 100}%`,
                    }}
                    className="bg-emerald-500 h-full"
                    title={`Offer: ${statusCounts.Offer}`}
                  />
                  <div
                    style={{
                      width: `${((statusCounts.Rejected || 0) / stats.totalOpportunities) * 100}%`,
                    }}
                    className="bg-rose-400 h-full"
                    title={`Rejected: ${statusCounts.Rejected}`}
                  />
                </>
              ) : (
                <div className="w-full bg-slate-200 h-full"></div>
              )}
            </div>

            {/* Status pills legend */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Saved
                </span>
                <span className="text-base font-extrabold text-slate-800">
                  {statusCounts.Saved}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">
                  Applied
                </span>
                <span className="text-base font-extrabold text-blue-800">
                  {statusCounts.Applied}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">
                  Interview
                </span>
                <span className="text-base font-extrabold text-amber-800">
                  {statusCounts.Interview}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                  Offer
                </span>
                <span className="text-base font-extrabold text-emerald-800">
                  {statusCounts.Offer}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
                <span className="text-[10px] uppercase font-bold text-rose-600 block">
                  Rejected
                </span>
                <span className="text-base font-extrabold text-rose-800">
                  {statusCounts.Rejected}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Opportunities */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Recent Opportunities
              </h3>
              <Link
                to="/jobs"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Go to Tracker
              </Link>
            </div>

            {stats?.recentJobs && stats.recentJobs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                          {job.title}
                        </span>
                        <StatusBadge status={job.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {job.company} {job.location ? `• ${job.location}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                        className="text-xs font-semibold py-1 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                      >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <Link
                        to="/ai-analysis"
                        state={{
                          jobTitle: job.title,
                          company: job.company,
                          jobDescription: job.description,
                          jobOpportunityId: job._id,
                        }}
                        className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                        title="Analyze with AI"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Analyze</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">No job opportunities recorded yet.</p>
                <Link
                  to="/jobs"
                  className="mt-3 inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add your first job opportunity
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Quick CV Access & Upcoming Events & Recent AI */}
        <div className="space-y-6">
          {/* Main CV Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Main CV Status
              </span>
              <Link
                to="/cv"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Manage
              </Link>
            </div>

            {user?.mainCV ? (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {user.mainCV.originalName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Uploaded {new Date(user.mainCV.uploadedAt).toLocaleDateString()} • {(user.mainCV.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to="/cv"
                    className="w-full text-center py-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-xl transition-colors"
                  >
                    View & Update CV
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 text-center">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">No Main CV Uploaded</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload your PDF CV to enable instant 1-click AI analyses across all jobs.
                  </p>
                </div>
                <Link
                  to="/cv"
                  className="inline-block w-full py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors"
                >
                  Upload Main CV
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Events / Follow-ups */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Upcoming Follow-ups
            </h3>

            {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
              <div className="space-y-2.5">
                {stats.upcomingEvents.map((event) => {
                  const isInterview = !!event.interviewDate;
                  const dateStr = isInterview
                    ? event.interviewDate
                    : event.followUpDate;

                  return (
                    <div
                      key={event._id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">
                          {event.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isInterview
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isInterview ? 'Interview' : 'Follow-up'}
                        </span>
                      </div>
                      <p className="text-slate-500">{event.company}</p>
                      <p className="text-slate-700 font-semibold text-[11px] pt-1">
                        📅 {new Date(dateStr).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No scheduled follow-up dates or upcoming interviews.
              </p>
            )}
          </div>

          {/* Recent AI Analysis Reports */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Recent AI Analyses
              </h3>
              <Link
                to="/ai-history"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                All History
              </Link>
            </div>

            {recentAnalyses && recentAnalyses.length > 0 ? (
              <div className="space-y-2.5">
                {recentAnalyses.map((item) => (
                  <Link
                    key={item._id}
                    to="/ai-history"
                    className="block p-3 rounded-2xl bg-slate-50 hover:bg-brand-50/50 border border-slate-200 hover:border-brand-200 transition-all text-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 group-hover:text-brand-700 truncate">
                        {item.jobTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-brand-800">
                        {item.matchScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.company || 'Direct Posting'} • {item.matchCategory}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400">
                <p>No previous AI analyses yet.</p>
                <Link
                  to="/ai-analysis"
                  className="mt-2 inline-block font-bold text-brand-600 hover:text-brand-700"
                >
                  Run your first analysis
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
