import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { uploadMainCV, getMainCV, deleteMainCV } from '../api/cv.js';
import CVUploader from '../components/cv/CVUploader.jsx';
import {
  FileText,
  FileCheck2,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  Info,
  Calendar,
  HardDrive,
  AlignLeft,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CVManagementPage = () => {
  const { user, refreshUser } = useAuth();
  const [cvInfo, setCvInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replacing, setReplacing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchCV = async () => {
    try {
      setLoading(true);
      const data = await getMainCV();
      setCvInfo(data);
    } catch (err) {
      console.error('Failed to load CV information:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCV();
  }, []);

  const handleUploadCV = async (file) => {
    try {
      setMessage({ text: '', type: '' });
      const res = await uploadMainCV(file);
      await refreshUser();
      await fetchCV();
      setReplacing(false);
      setMessage({
        text: 'Main CV successfully uploaded and parsed!',
        type: 'success',
      });
    } catch (err) {
      setMessage({
        text:
          err.response?.data?.message ||
          'Failed to upload CV. Please ensure the PDF is valid.',
        type: 'error',
      });
    }
  };

  const handleDeleteCV = async () => {
    if (
      window.confirm(
        'Are you sure you want to remove your main CV? Historical AI reports will still remain intact.'
      )
    ) {
      try {
        await deleteMainCV();
        await refreshUser();
        await fetchCV();
        setMessage({
          text: 'Main CV removed successfully.',
          type: 'success',
        });
      } catch (err) {
        setMessage({
          text: 'Failed to delete CV.',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            CV Management Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your master CV in PDF format. Used automatically for AI qualification assessments.
          </p>
        </div>

        {cvInfo?.hasCV && (
          <Link
            to="/ai-analysis"
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Analyze against a Job
          </Link>
        )}
      </div>

      {/* Notifications */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ text: '', type: '' })}
            className="text-xs font-bold underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Info Callout */}
      <div className="p-4 bg-brand-50/60 border border-brand-100 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-xs text-brand-950 space-y-1">
          <p className="font-bold">How CareerTech handles your CV:</p>
          <p className="text-brand-800 leading-relaxed">
            Your primary CV is securely stored and parsed. When you run an AI analysis, CareerTech compares this document against job requirements. If you have tailored CV versions for specific positions, you can also upload a one-time PDF directly on the analysis page without replacing this master file.
          </p>
        </div>
      </div>

      {/* Current Main CV Card */}
      {loading ? (
        <div className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
      ) : cvInfo?.hasCV && cvInfo.cv ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-inner">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Active Main CV
                  </span>
                  <span className="text-xs text-slate-400">PDF Document</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 break-all">
                  {cvInfo.cv.originalName}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Uploaded: {new Date(cvInfo.cv.uploadedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    Size: {(cvInfo.cv.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                    Extracted Text: {cvInfo.cv.fullTextLength} characters
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <a
                href="/api/cv/main/file"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                title="Download or preview PDF file"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                View PDF
              </a>
              <button
                onClick={() => setReplacing(!replacing)}
                className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                {replacing ? 'Cancel Replace' : 'Replace CV'}
              </button>
              <button
                onClick={handleDeleteCV}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete CV"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Replacement uploader area */}
          {replacing && (
            <div className="p-5 rounded-2xl bg-brand-50/40 border border-brand-200 space-y-3 animate-in fade-in duration-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Upload New Version to Replace Current Main CV
              </h4>
              <CVUploader
                onUpload={handleUploadCV}
                label="Select updated PDF CV"
                buttonText="Replace CV"
              />
            </div>
          )}

          {/* Extracted Text Preview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                Extracted Text Preview (Used by AI Engine)
              </h3>
              <button
                onClick={() => setPreviewOpen(!previewOpen)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                {previewOpen ? 'Hide Text' : 'Inspect Text'}
              </button>
            </div>

            {previewOpen ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
                {cvInfo.cv.snippet}
              </div>
            ) : (
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-xs text-slate-500 italic">
                "{cvInfo.cv.snippet.substring(0, 200)}..."
              </div>
            )}
          </div>
        </div>
      ) : (
        /* No CV uploaded yet */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Upload Your Master CV
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your current CV in PDF format. We will extract and index your skills, experiences, and projects for instant AI analysis.
            </p>
          </div>

          <CVUploader
            onUpload={handleUploadCV}
            label="Upload your CV (PDF)"
            buttonText="Upload CV"
          />
        </div>
      )}
    </div>
  );
};

export default CVManagementPage;
