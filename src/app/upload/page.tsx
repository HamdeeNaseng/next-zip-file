'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    fileName?: string;
    fileSize?: number;
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null); // Clear previous results
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setUploadResult({
        success: false,
        message: 'Please select a file to upload'
      });
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: result.message,
          fileName: result.fileName,
          fileSize: result.fileSize
        });
        setSelectedFile(null);
        // Reset the file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadResult({
          success: false,
          message: result.message || 'Upload failed'
        });
      }
    } catch (error: unknown) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: 'An error occurred during upload'
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
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
            File Upload
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select and upload your files securely
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Input */}
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose File
              </label>
              <div className="relative">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    dark:file:bg-blue-900 dark:file:text-blue-300
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-800
                    cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg
                    bg-gray-50 dark:bg-slate-700 p-3"
                  accept="*/*"
                />
              </div>
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: <span className="font-medium">{selectedFile.name}</span> 
                  ({formatFileSize(selectedFile.size)})
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                text-white font-semibold py-3 px-4 rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                dark:focus:ring-offset-slate-800"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload File'
              )}
            </button>
          </form>

          {/* Upload Result */}
          {uploadResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              uploadResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className={`text-sm ${
                uploadResult.success 
                  ? 'text-green-800 dark:text-green-300' 
                  : 'text-red-800 dark:text-red-300'
              }`}>
                <div className="font-medium mb-1">
                  {uploadResult.success ? '✅ Success!' : '❌ Error'}
                </div>
                <div>{uploadResult.message}</div>
                {uploadResult.success && uploadResult.fileName && (
                  <div className="mt-2 text-xs">
                    <div><strong>Saved as:</strong> {uploadResult.fileName}</div>
                    <div className="text-gray-500 dark:text-gray-400 mt-1">
                      ✅ File organized with date-based naming for better management
                    </div>
                    {uploadResult.fileSize && (
                      <div className="mt-1">Size: {formatFileSize(uploadResult.fileSize)}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="text-center mt-8 space-y-4">
          <div className="space-x-4">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              ← Back to Home
            </Link>
            <Link
              href="/files"
              className="inline-flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
            >
              View Uploaded Files →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
