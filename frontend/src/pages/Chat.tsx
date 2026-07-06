import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Send, FileText, User, Bot, AlertCircle } from 'lucide-react';

interface Document {
  _id: string;
  name: string;
}

interface Message {
  _id: string;
  question: string;
  aiResponse: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [history, setHistory] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const docRes = await api.get('/documents');
        setDocuments(docRes.data);
        if (docRes.data.length > 0) {
          setSelectedDoc(docRes.data[0]._id);
        }
      } catch (err) {
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedDoc) return;
    
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/ask/history?documentId=${selectedDoc}`);
        // History returns newest first, we want oldest first for chat view
        setHistory(res.data.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchHistory();
  }, [selectedDoc]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !selectedDoc) return;

    const currentQ = question;
    setQuestion('');
    setAsking(true);
    setError('');

    // Optimistically add to UI with temporary ID
    const tempMsg: Message = {
      _id: Date.now().toString(),
      question: currentQ,
      aiResponse: '...', // loading state
      timestamp: new Date().toISOString()
    };
    setHistory(prev => [...prev, tempMsg]);

    try {
      const res = await api.post('/ask', {
        documentId: selectedDoc,
        question: currentQ
      });
      
      // Replace temp message with actual
      setHistory(prev => prev.map(msg => msg._id === tempMsg._id ? res.data : msg));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get answer');
      // Remove temp message
      setHistory(prev => prev.filter(msg => msg._id !== tempMsg._id));
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Ask AI</h2>
          <p className="text-sm text-gray-500">Select a document and ask questions</p>
        </div>
        
        <div className="flex items-center w-full sm:w-64">
          <FileText size={18} className="text-gray-400 mr-2" />
          <select
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
          >
            <option value="" disabled>Select Document</option>
            {documents.map(doc => (
              <option key={doc._id} value={doc._id}>{doc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30">
        {!selectedDoc ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Please select a document to start chatting.
          </div>
        ) : history.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-gray-400">
            <Bot size={48} className="mb-4 opacity-50" />
            <p>No questions asked yet for this document.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((msg) => (
              <div key={msg._id} className="space-y-4">
                {/* User message */}
                <div className="flex items-start justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm py-3 px-4 max-w-[80%] shadow-sm">
                    <p className="text-sm whitespace-pre-wrap">{msg.question}</p>
                  </div>
                  <div className="ml-3 bg-gray-200 p-2 rounded-full text-gray-600 flex-shrink-0 mt-1">
                    <User size={16} />
                  </div>
                </div>
                
                {/* AI response */}
                <div className="flex items-start">
                  <div className="mr-3 bg-indigo-100 p-2 rounded-full text-indigo-600 flex-shrink-0 mt-1">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm py-3 px-4 max-w-[80%] shadow-sm">
                    {msg.aiResponse === '...' ? (
                      <div className="flex space-x-1 items-center h-5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    ) : (
                      <div className="text-sm prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: msg.aiResponse.replace(/\n/g, '<br/>') }} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {error && (
          <div className="mb-3 text-sm text-red-600 flex items-center">
            <AlertCircle size={16} className="mr-1" /> {error}
          </div>
        )}
        <form onSubmit={handleAsk} className="relative flex items-center">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-gray-50"
            placeholder="Ask a question about the document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!selectedDoc || asking}
          />
          <button
            type="submit"
            disabled={!selectedDoc || asking || !question.trim()}
            className="absolute right-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
