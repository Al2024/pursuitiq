'use client';

import { useState } from 'react';
import { Upload, FileText, Play, Eye, Edit3, Download } from 'lucide-react';

export default function NewProjectScreen() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [fileMetadata, setFileMetadata] = useState<any>(null);

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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Project</h2>
        <p className="text-gray-600">Upload an RFP document and let AI analyze it for key insights</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Upload className="w-6 h-6 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Upload RFP Document</h3>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center">
              {uploadedFile ? (
                <div className="space-y-4">
                  <FileText className="w-12 h-12 text-blue-500 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Drop your RFP here</p>
                    <p className="text-gray-500">or click to browse files</p>
                  </div>
                  <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
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

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!uploadedFile || isAnalyzing}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Go/No-Go Recommendation</label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisResults.goNoGoSuggestion === 'GO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {analysisResults.goNoGoSuggestion}
                    </span>
                    <span className="text-sm text-gray-500">
                      {analysisResults.confidence}% confidence
                    </span>
                  </div>
                  {analysisResults.rationale && (
                    <p className="text-sm text-gray-600 mt-2">{analysisResults.rationale}</p>
                  )}
                </div>
              </div>
            </div>

            {/* File Information */}
            {fileMetadata && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded File</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">File Name:</span>
                    <span className="text-gray-900">{fileMetadata.originalName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Size:</span>
                    <span className="text-gray-900">{(fileMetadata.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Type:</span>
                    <span className="text-gray-900">{fileMetadata.mimeType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Uploaded:</span>
                    <span className="text-gray-900">{new Date(fileMetadata.uploadedAt).toLocaleString()}</span>
                  </div>
                  {fileMetadata.url && fileMetadata.url !== '#' && (
                    <div className="pt-3 border-t border-gray-200">
                      <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download File</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Disciplines</h3>
              <div className="space-y-2">
                {analysisResults.disciplines.map((discipline: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{discipline}</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Dates</h3>
              <div className="space-y-3">
                {Object.entries(analysisResults.dates).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">{value}</span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Identified Risks</h3>
              <div className="space-y-2">
                {analysisResults.risks.map((risk: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-900">{risk}</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex space-x-4">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Eye className="w-4 h-4" />
                  <span>Review & Edit</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <FileText className="w-4 h-4" />
                  <span>Export Summary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
