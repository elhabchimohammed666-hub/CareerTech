import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { analyzeCV } from '../api/ai.js';
import { getJobs } from '../api/jobs.js';
import CVUploader from '../components/cv/CVUploader.jsx';
import AnalysisReportCard from '../components/ai/AnalysisReportCard.jsx';
import {
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Briefcase,
  ArrowRight,
  History,
  FileCheck2,
} from 'lucide-react';

export const AIAnalysisPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Initial state passed from JobCard or Dashboard if any
  const initialJobTitle = location.state?.jobTitle || '';
  const initialCompany = location.state?.company || '';
  const initialJobDescription = location.state?.jobDescription || '';
  const initialJobOpportunityId = location.state?.jobOpportunityId || '';

  // Form State
  const [useMainCV, setUseMainCV] = useState(true);
  const [customFile, setCustomFile] = useState(null);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [company, setCompany] = useState(initialCompany);
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [jobOpportunityId, setJobOpportunityId] = useState(initialJobOpportunityId);

  // Available tracked jobs for quick fill
  const [savedJobs, setSavedJobs] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved jobs for dropdown selection
    const loadJobs = async () => {
      try {
        const res = await getJobs();
        setSavedJobs(res.jobs || []);
      } catch (e) {
        // ignore
      }
    };
    loadJobs();
  }, []);

  // Handle picking a saved job from dropdown
  const handleSelectSavedJob = (e) => {
    const selectedId = e.target.value;
    setJobOpportunityId(selectedId);
    if (!selectedId) return;

    const found = savedJobs.find((j) => j._id === selectedId);
    if (found) {
      setJobTitle(found.title);
      setCompany(found.company);
      setJobDescription(found.description);
    }
  };

  const handleCustomFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setError('Please select a valid PDF file.');
        return;
      }
      setCustomFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError('Please provide a complete job description (at least 20 characters).');
      return;
    }

    if (useMainCV && (!user?.mainCV || !user.mainCV.extractedText)) {
      setError(
        'You have no main CV uploaded. Please upload a main CV in CV Management, or choose "Upload Alternative CV" below.'
      );
      return;
    }

    if (!useMainCV && !customFile) {
      setError('Please select a PDF document for this specific analysis.');
      return;
    }

    setLoading(true);
    setAnalysisResult(null);

    try {
      setStatusStep('Extracting document text & structural components...');
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(400);

      setStatusStep('Evaluating qualifications against position requirements...');
      const response = await analyzeCV({
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim() || 'Untitled Position',
        company: company.trim(),
        jobOpportunityId: jobOpportunityId || null,
        useMainCV: useMainCV ? 'true' : 'false',
        customCVFile: !useMainCV ? customFile : null,
      });

      setStatusStep('Validating grounded evidence & structuring report...');
      await delay(300);

      setAnalysisResult(response.analysis);
      setStatusStep('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Analysis failed. Please try again with valid PDF text and job description.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Qualification Evaluation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analyze CV Against Job Description
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate how effectively your CV demonstrates job qualifications without altering your application status or inventing experience.
          </p>
        </div>

        <Link
          to="/ai-history"
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
        >
          <History className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          View Analysis History
        </Link>
      </div>

      {/* Analysis Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: CV Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Step 1: Choose CV Document to Analyze
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Use Main CV */}
              <div
                onClick={() => setUseMainCV(true)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  useMainCV
                    ? 'border-brand-600 bg-brand-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        useMainCV
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Use Main CV</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {user?.mainCV
                          ? `${user.mainCV.originalName}`
                          : 'No main CV uploaded yet'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="cvChoice"
                    checked={useMainCV}
                    onChange={() => setUseMainCV(true)}
                    className="mt-1 text-brand-600 focus:ring-brand-500"
                  />
                </div>
                {!user?.mainCV && (
                  <Link
                    to="/cv"
                    className="mt-3 block text-xs font-bold text-amber-600 hover:underline"
                  >
                    Upload Main CV now →
                  </Link>
                )}
              </div>

              {/* Option B: Upload Alternative CV */}
              <div
                onClick={() => setUseMainCV(false)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  !useMainCV
                    ? 'border-brand-600 bg-brand-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        !useMainCV
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Upload Alternative CV
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        One-time PDF (won't overwrite main CV)
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="cvChoice"
                    checked={!useMainCV}
                    onChange={() => setUseMainCV(false)}
                    className="mt-1 text-brand-600 focus:ring-brand-500"
                  />
                </div>

                {!useMainCV && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleCustomFileSelect}
                      className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-100 file:text-brand-800 hover:file:bg-brand-200 cursor-pointer"
                    />
                    {customFile && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                        ✓ Selected: {customFile.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Job Information */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Step 2: Position Details & Job Description
              </label>

              {/* Pre-fill from tracked job */}
              {savedJobs.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Pre-fill from:</span>
                  <select
                    value={jobOpportunityId}
                    onChange={handleSelectSavedJob}
                    className="text-xs font-semibold py-1 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer focus:outline-none"
                  >
                    <option value="">Select a saved opportunity...</option>
                    {savedJobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title} ({j.company})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Veloce Technologies"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Description & Key Requirements <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements, responsibilities, and qualification details here..."
                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 leading-relaxed"
              />
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button & Progress Indicator */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {loading && (
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                  <span>{statusStep || 'Processing AI analysis...'}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Qualifications...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Assessment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
            <span className="text-xs text-slate-500">
              Saved automatically to your analysis history
            </span>
          </div>
          <AnalysisReportCard report={analysisResult} />
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPage;
