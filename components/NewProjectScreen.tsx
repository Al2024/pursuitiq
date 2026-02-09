'use client';

import { useState } from 'react';
import { Upload, FileText, Play, Eye, Edit3, Download } from 'lucide-react';

export default function NewProjectScreen() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [fileMetadata, setFileMetadata] = useState<any>(null);

  const formatRisk = (risk: unknown) => {
    if (typeof risk === 'string') {
      return risk;
    }
    if (risk && typeof risk === 'object') {
      const riskObj = risk as { category?: string; description?: string };
      if (riskObj.category && riskObj.description) {
        return `${riskObj.category}: ${riskObj.description}`;
      }
      if (riskObj.description) {
        return riskObj.description;
      }
      if (riskObj.category) {
        return riskObj.category;
      }
    }
    return 'Uncategorized risk';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Reset previous results when new file is uploaded
      setAnalysisResults(null);
      setFileMetadata(null);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    try {
      console.log('Starting analysis for file:', uploadedFile.name);
      console.log('File type:', uploadedFile.type);
      console.log('File size:', uploadedFile.size);

      const formData = new FormData();
      formData.append('file', uploadedFile);

      console.log('Making API request to /api/analyze...');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      console.log('Response received:', response.status, response.statusText);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const results = await response.json();
      console.log('Analysis results:', results);

      // Extract file metadata and analysis results
      const { fileMetadata: metadata, ...analysisData } = results;
      setAnalysisResults(analysisData);
      setFileMetadata(metadata);

    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to mock data if API fails
      setAnalysisResults({
        disciplines: ['Architecture', 'Structural Engineering', 'MEP'],
        dates: {
          submission: '2025-12-15',
          completion: '2026-06-30',
          siteVisit: '2025-11-20'
        },
        risks: [
          'Tight schedule constraints',
          'Complex site conditions',
          'Regulatory compliance requirements'
        ],
        goNoGoSuggestion: 'GO',
        confidence: 75,
        rationale: `Analysis completed with fallback data. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });

      // Set mock file metadata for fallback
      if (uploadedFile) {
        setFileMetadata({
          id: 'fallback-' + Date.now(),
          originalName: uploadedFile.name,
          mimeType: uploadedFile.type,
          size: uploadedFile.size,
          uploadedAt: new Date().toISOString(),
          url: '#'
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (fileMetadata && fileMetadata.url && fileMetadata.url !== '#') {
      window.open(fileMetadata.url, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/30 border border-slate-800/80 text-center">
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Create New Project</h2>
        <p className="text-slate-400">Upload an RFP document and let AI analyze it for key insights</p>
      </div>

      {/* Upload Section */}
      <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/30 border border-slate-800/80 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Upload className="w-6 h-6 text-brand-300" />
            <h3 className="text-lg font-semibold text-white">Upload RFP Document</h3>
          </div>

          <div className="border-2 border-dashed border-slate-700/70 bg-slate-950/40 rounded-2xl p-10">
            <div className="text-center">
              {uploadedFile ? (
                <div className="space-y-4">
                  <FileText className="w-12 h-12 text-brand-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-white">{uploadedFile.name}</p>
                    <p className="text-sm text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-rose-300 hover:text-rose-200 text-sm font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-slate-500 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-slate-100">Drop your RFP here</p>
                    <p className="text-slate-400">or click to browse files</p>
                  </div>
                  <label className="inline-flex items-center px-5 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-500 cursor-pointer uppercase tracking-[0.2em] text-xs font-semibold">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.md,.doc"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!uploadedFile || isAnalyzing}
              className="flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                    <span>Analyze Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Analysis Summary */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/30 border border-slate-800/80">
              <h3 className="text-lg font-semibold text-white mb-4">Analysis Summary</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Go/No-Go Recommendation</label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.3em] border ${
                      analysisResults.goNoGoSuggestion === 'GO'
                        ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-200 border-rose-500/30'
                    }`}>
                      {analysisResults.goNoGoSuggestion}
                    </span>
                    <span className="text-sm text-slate-400">
                      {analysisResults.confidence}% confidence
                    </span>
                  </div>
                  {analysisResults.rationale && (
                    <p className="text-sm text-slate-400 mt-2">{analysisResults.rationale}</p>
                  )}
                </div>
              </div>
            </div>

            {/* File Information */}
            {fileMetadata && (
              <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/30 border border-slate-800/80">
                <h3 className="text-lg font-semibold text-white mb-4">Uploaded File</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">File Name:</span>
                    <span className="text-slate-100">{fileMetadata.originalName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-100">{(fileMetadata.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-100">{fileMetadata.mimeType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Uploaded:</span>
                    <span className="text-slate-100">{new Date(fileMetadata.uploadedAt).toLocaleString()}</span>
                  </div>
                  {fileMetadata.url && fileMetadata.url !== '#' && (
                    <div className="pt-3 border-t border-slate-800">
                      <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download File</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/30 border border-slate-800/80">
              <h3 className="text-lg font-semibold text-white mb-4">Required Disciplines</h3>
              <div className="space-y-2">
                {analysisResults.disciplines.map((discipline: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg">
                    <span className="text-slate-100">{discipline}</span>
                    <button className="text-brand-300 hover:text-brand-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/30 border border-slate-800/80">
              <h3 className="text-lg font-semibold text-white mb-4">Key Dates</h3>
              <div className="space-y-3">
                {Object.entries(analysisResults.dates).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-100">{value}</span>
                      <button className="text-brand-300 hover:text-brand-200">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/30 border border-slate-800/80">
              <h3 className="text-lg font-semibold text-white mb-4">Identified Risks</h3>
              <div className="space-y-2">
                {analysisResults.risks.map((risk: unknown, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <span className="text-slate-100">{formatRisk(risk)}</span>
                    <button className="text-brand-300 hover:text-brand-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/30 border border-slate-800/80">
              <div className="flex space-x-4">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-900/70 border border-slate-700 text-slate-100 rounded-lg hover:border-brand-500/40 hover:text-white">
                  <Eye className="w-4 h-4" />
                  <span>Review & Edit</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-500">
                  <FileText className="w-4 h-4" />
                  <span>Export Summary</span>
                </button>
              </div>
            </div>

            <a
              href="https://doc-rag-app.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/30 border border-slate-800/80 flex items-center justify-between hover:border-brand-500/40 transition"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white">Chat with Legal</span>
              <span className="text-brand-300">→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
