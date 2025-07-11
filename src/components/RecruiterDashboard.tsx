import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostOpportunityForm from './PostOpportunityForm';
// DEBUG: Ensure a file named exactly "ViewJobSeekers.tsx" (with this capitalization)
// exists in the same folder as this file (src/components).
import ViewJobSeekers from './ViewJobSeekers';

const RecruiterDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Recruiter Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {userProfile?.name || 'Recruiter'}</p>
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
              onClick={() => setActiveTab('browse')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'browse'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Browse Candidates
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'post'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Post an Opportunity
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'browse' && <ViewJobSeekers />}
          {activeTab === 'post' && <PostOpportunityForm />}
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
