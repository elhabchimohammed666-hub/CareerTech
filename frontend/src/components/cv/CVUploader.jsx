import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const CVUploader = ({ onUpload, label = 'Upload CV (PDF format)', buttonText = 'Select PDF' }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const validateFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return false;

    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.toLowerCase().endsWith('.pdf')
    ) {
      setError('Only PDF documents are supported. Please select a valid .pdf file.');
      return false;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10 MB limit. Please select a smaller PDF.');
      return false;
    }

    return true;
  };

  const handleFiles = (files) => {
    if (files && files[0]) {
      const selected = files[0];
      if (validateFile(selected)) {
        setFile(selected);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      await onUpload(file);
      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to upload document.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-brand-500 bg-brand-50/50'
            : file
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          {file ? (
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {file ? file.name : label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {file
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload`
                : 'Drag & drop your PDF file here, or click to browse'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {file && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Processing PDF...
              </>
            ) : (
              'Confirm Upload'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CVUploader;
