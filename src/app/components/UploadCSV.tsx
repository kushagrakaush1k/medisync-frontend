'use client';

import { useState } from 'react';
import { uploadCSV } from '@/lib/api';

interface UploadCSVProps {
  onUploadSuccess?: () => void;
}

export default function UploadCSV({ onUploadSuccess }: UploadCSVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      setUploadStatus('error');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setMessage('Please upload a CSV file');
      setUploadStatus('error');
      return;
    }

    try {
      setLoading(true);
      setUploadStatus(null);
      const result = await uploadCSV(file);
      
      setMessage(
        `Upload successful! Created: ${result.created}, Skipped: ${result.skipped}`
      );
      setUploadStatus('success');
      setFile(null);
      
      if (onUploadSuccess) {
        setTimeout(onUploadSuccess, 1000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setMessage(`Upload failed: ${errorMessage}`);
      setUploadStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Patient CSV</h2>
      
      <div className="flex gap-3 mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={loading}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded mb-4 ${
          uploadStatus === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message}
        </div>
      )}

      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
        CSV Format: patient_id, first_name, last_name, date_of_birth (YYYY-MM-DD), gender
      </p>
    </div>
  );
}