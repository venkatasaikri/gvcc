import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { FileText, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardMetrics {
  totalDocuments: number;
  totalQuestions: number;
  recentUploads: {
    _id: string;
    name: string;
    mimeType: string;
    uploadTimestamp: string;
  }[];
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/dashboard');
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Documents</p>
            <p className="text-2xl font-bold text-gray-900">{metrics?.totalDocuments || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-50 p-3 rounded-lg text-green-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Questions Asked</p>
            <p className="text-2xl font-bold text-gray-900">{metrics?.totalQuestions || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Uploads</h3>
          <Link to="/documents" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {metrics?.recentUploads && metrics.recentUploads.length > 0 ? (
            metrics.recentUploads.map((doc) => (
              <div key={doc._id} className="px-6 py-4 flex items-center space-x-4">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2 mt-1">
                    <Clock size={12} />
                    <span>{new Date(doc.uploadTimestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No documents uploaded yet.</p>
              <Link to="/documents" className="text-indigo-600 hover:underline mt-2 inline-block text-sm">Upload your first document</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
