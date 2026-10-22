import React, { useState, useEffect } from 'react';
import {
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getExportPdfUrl,
} from '../api/ai.js';
import AnalysisReportCard from '../components/ai/AnalysisReportCard.jsx';
import {
  History,
  Trash2,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  FileText,
  Building,
  CheckCircle,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getAnalysisHistory();
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenReport = async (id) => {
    try {
      setLoadingReport(true);
      const data = await getAnalysisById(id);
      setSelectedReport(data.report);
      // Scroll to top of report view
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this historical analysis?')) {
      try {
        await deleteAnalysis(id);
        setHistory((prev) => prev.filter((item) => item._id !== id));
        if (selectedReport?._id === id) {
          setSelectedReport(null);
        }
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Analysis History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access, review, and download previous CV assessments without having to regenerate them.
          </p>
        </div>

        <Link
          to="/ai-analysis"
          className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Run New Analysis
        </Link>
      </div>

      {/* Selected Report Viewer Section */}
      {selectedReport && (
        <div className="space-y-4 p-6 bg-slate-100 rounded-3xl border border-slate-300 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Viewing Historical Report
            </span>
            <button
              onClick={() => setSelectedReport(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <AnalysisReportCard report={selectedReport} />
        </div>
      )}

      {/* History List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Saved Assessments ({history.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              No historical AI reports generated yet.
            </p>
            <Link
              to="/ai-analysis"
              className="inline-block text-xs font-bold text-brand-600 hover:underline"
            >
              Evaluate your first CV against a job description →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((item) => {
              const isSelected = selectedReport?._id === item._id;
              return (
                <div
                  key={item._id}
                  onClick={() => handleOpenReport(item._id)}
                  className={`py-4 px-3 sm:px-4 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-brand-50/80 border border-brand-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.jobTitle}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.matchCategory === 'Strong Match'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.matchCategory === 'Good Match'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.matchCategory} ({item.matchScore}%)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      {item.company && <span>🏢 {item.company}</span>}
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        CV: {item.cvOriginalName} ({item.cvSource === 'main' ? 'Main CV' : 'Custom Upload'})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-2 self-start sm:self-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={getExportPdfUrl(item._id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Download PDF report"
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      onClick={(e) => handleDelete(e, item._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenReport(item._id)}
                      className="px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors flex items-center gap-1"
                    >
                      Review Report
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHistoryPage;
