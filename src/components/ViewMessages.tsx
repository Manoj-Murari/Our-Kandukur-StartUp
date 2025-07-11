import React from 'react';
import { useMessages } from '../hooks/useMessages';
import { Loader2, AlertCircle, Mail, User, Calendar } from 'lucide-react';

const ViewMessages: React.FC = () => {
  const { messages, loading, error, refetch } = useMessages();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg">
        <AlertCircle className="mx-auto h-8 w-8" />
        <p className="mt-2">{error}</p>
        <button onClick={refetch} className="mt-4 text-sm font-semibold text-red-700 underline">Try Again</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Form Submissions</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages have been received yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 flex items-center"><User className="h-4 w-4 mr-2 text-gray-500"/>{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 flex items-center hover:underline"><Mail className="h-4 w-4 mr-2 text-gray-500"/>{msg.email}</a>
                </div>
                <p className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1"/>
                  {new Date(msg.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </div>
              <p className="mt-4 text-gray-700 bg-gray-50 p-3 rounded-md">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMessages;
