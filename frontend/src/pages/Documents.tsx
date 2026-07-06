import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Upload, Trash2, FileText, AlertCircle } from 'lucide-react';

interface Document {
  _id: string;
  name: string;
  uploadTimestamp: string;
  metadata: {
    size: number;
  };
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (err: any) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional client-side validation
    const validTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.md')) {
      setError('Unsupported file type. Please upload PDF, TXT, or MD.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchDocuments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((d) => d._id !== id));
    } catch (err: any) {
      setError('Failed to delete document');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.txt,.md,text/plain,application/pdf"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <Upload size={18} className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700 border border-red-200">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-gray-500">Upload your first document to start asking questions.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <li key={doc._id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600 mr-4">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded on {new Date(doc.uploadTimestamp).toLocaleDateString()} • {(doc.metadata.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Document"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Documents;
