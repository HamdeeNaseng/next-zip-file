'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FileInfo {
  name: string;
  originalName: string;
  size: number;
  uploadDate: string;
  modifiedDate: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zipLoading, setZipLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      
      if (response.ok) {
        setFiles(data.files);
      } else {
        setError(data.message || 'Failed to fetch files');
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleFileSelect = (fileName: string, isChecked: boolean) => {
    setSelectedFiles(prev => {
      if (isChecked) {
        return [...prev, fileName];
      } else {
        return prev.filter(file => file !== fileName);
      }
    });
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedFiles(files.map(file => file.name));
    } else {
      setSelectedFiles([]);
    }
  };

  const downloadAllAsZip = async () => {
    if (files.length === 0) {
      alert('No files to download');
      return;
    }

    setZipLoading(true);
    try {
      const response = await fetch('/api/zip-all');
      
      if (response.ok) {
        // Get the blob from response
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Get filename from response headers or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'all-files.zip';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create ZIP file');
      }
    } catch (err) {
      console.error('Error downloading ZIP:', err);
      alert('Error downloading files');
    } finally {
      setZipLoading(false);
    }
  };

  const downloadSelectedAsZip = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to download');
      return;
    }

    setZipLoading(true);
    try {
      const response = await fetch('/api/zip-selected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: selectedFiles }),
      });
      
      if (response.ok) {
        // Get the blob from response
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Get filename from response headers or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'selected-files.zip';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create ZIP file');
      }
    } catch (err) {
      console.error('Error downloading ZIP:', err);
      alert('Error downloading selected files');
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={25}
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Uploaded Files
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your uploaded files
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Upload New File
          </Link>
          <button
            onClick={downloadSelectedAsZip}
            disabled={selectedFiles.length === 0 || zipLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            {zipLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating ZIP...
              </>
            ) : (
              <>
                📦 Download Selected ({selectedFiles.length})
              </>
            )}
          </button>
          <button
            onClick={downloadAllAsZip}
            disabled={files.length === 0 || zipLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            {zipLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating ZIP...
              </>
            ) : (
              <>
                📥 Download All ({files.length})
              </>
            )}
          </button>
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading files...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">❌ {error}</div>
              <button
                onClick={fetchFiles}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No files uploaded yet</p>
              <Link
                href="/upload"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Upload Your First File
              </Link>
            </div>
          ) : (
            <>
              {/* Selection Toolbar */}
              {files.length > 0 && (
                <div className="bg-gray-50 dark:bg-slate-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedFiles.length === files.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Select All ({files.length} files)
                      </label>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFiles.length > 0 ? (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {selectedFiles.length} selected
                        </span>
                      ) : (
                        'No files selected'
                      )}
                    </div>
                  </div>
                </div>
              )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedFiles.length === files.length && files.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {files.map((file) => (
                    <tr key={file.name} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.name)}
                          onChange={(e) => handleFileSelect(file.name, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6 mr-3">
                            📄
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Original: {file.originalName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(file.uploadDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/view/${encodeURIComponent(file.name)}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          View
                        </Link>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          onClick={() => {
                            window.open(`/api/download/${encodeURIComponent(file.name)}`, '_blank');
                          }}
                        >
                          Download
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => {
                            // In a real app, you'd implement delete functionality
                            alert('Delete functionality would be implemented here');
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>

        {/* File count and ZIP info */}
        {files.length > 0 && (
          <div className="text-center mt-4 space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total files: {files.length} | Selected: {selectedFiles.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              ✅ Select files with checkboxes, then use &ldquo;Download Selected&rdquo; or download all files at once
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
