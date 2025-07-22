'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface FileInfo {
  name: string;
  originalName: string;
  size: number;
  uploadDate: string;
  modifiedDate: string;
}

export default function ViewFilePage() {
  const params = useParams();
  const filename = params.filename as string;
  
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        // Fetch file list to get metadata for this specific file
        const response = await fetch('/api/files');
        const data = await response.json();
        
        if (response.ok) {
          const file = data.files.find((f: FileInfo) => f.name === filename);
          if (file) {
            setFileInfo(file);
          } else {
            setError('File not found');
          }
        } else {
          setError(data.message || 'Failed to fetch file info');
        }
      } catch (err) {
        console.error('Error fetching file info:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    if (filename) {
      fetchFileInfo();
      setFileUrl(`/api/files/${encodeURIComponent(filename)}`);
    }
  }, [filename]);

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

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = getFileType(fileName);
    return imageExtensions.includes(extension);
  };

  const isVideoFile = (fileName: string) => {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    const extension = getFileType(fileName);
    return videoExtensions.includes(extension);
  };

  const isAudioFile = (fileName: string) => {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
    const extension = getFileType(fileName);
    return audioExtensions.includes(extension);
  };

  const isTextFile = (fileName: string) => {
    const textExtensions = ['txt', 'md', 'json', 'xml', 'csv', 'log'];
    const extension = getFileType(fileName);
    return textExtensions.includes(extension);
  };

  const isPdfFile = (fileName: string) => {
    return getFileType(fileName) === 'pdf';
  };

  const downloadFile = () => {
    window.open(`/api/download/${encodeURIComponent(filename)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">❌ {error}</div>
          <Link
            href="/files"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Files
          </Link>
        </div>
      </div>
    );
  }

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
            File Viewer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filename}
          </p>
          {fileInfo?.originalName && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Original: {fileInfo.originalName}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            href="/files"
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            ← Back to Files
          </Link>
          <button
            onClick={downloadFile}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            📥 Download
          </button>
        </div>

        {/* File Info Card */}
        {fileInfo && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  File Name (Date-based)
                </label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                  {filename}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Original Name
                </label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {fileInfo.originalName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  File Size
                </label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatFileSize(fileInfo.size)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  File Type
                </label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                  {getFileType(fileInfo.name)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Upload Date
                </label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(fileInfo.uploadDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Preview */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              File Preview
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              {isImageFile(filename) ? (
                <div className="max-w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl}
                    alt={fileInfo?.originalName || filename}
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-gray-500">❌ Unable to preview this image</div>';
                      }
                    }}
                  />
                </div>
              ) : isPdfFile(filename) ? (
                <div className="space-y-4">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-600 dark:text-gray-400">PDF Document</p>
                  <iframe
                    src={fileUrl}
                    className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded"
                    title="PDF Preview"
                  />
                </div>
              ) : isVideoFile(filename) ? (
                <div className="space-y-4">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Video File</p>
                  <video
                    controls
                    className="max-w-full max-h-96 mx-auto rounded-lg"
                    src={fileUrl}
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              ) : isAudioFile(filename) ? (
                <div className="space-y-4">
                  <div className="text-6xl mb-4">🎵</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Audio File</p>
                  <audio
                    controls
                    className="w-full max-w-md mx-auto"
                    src={fileUrl}
                  >
                    Your browser does not support audio playback.
                  </audio>
                </div>
              ) : isTextFile(filename) ? (
                <div className="space-y-4">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Text File</p>
                  <iframe
                    src={fileUrl}
                    className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded bg-white"
                    title="Text Preview"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Preview not available for this file type
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    File type: .{getFileType(filename)}
                  </p>
                  <button
                    onClick={downloadFile}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Download to View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
