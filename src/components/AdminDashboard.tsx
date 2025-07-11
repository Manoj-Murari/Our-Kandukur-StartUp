import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostOpportunityForm from './PostOpportunityForm';
import ViewMessages from './ViewMessages'; // Import the new component

const AdminDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('opportunities'); // To control which tab is shown

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {userProfile?.name || 'Admin'}</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'opportunities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Post Opportunity
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              View Messages
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'opportunities' && <PostOpportunityForm />}
          {activeTab === 'messages' && <ViewMessages />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;