import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostOpportunityForm from './PostOpportunityForm';
import ViewMessages from './ViewMessages';
import ManageTeam from './ManageTeam';
import ManageOpportunities from './ManageOpportunities'; // Import new component

const AdminDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('opportunities');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'opportunities': return <PostOpportunityForm />;
      case 'manage-opps': return <ManageOpportunities />; // New case
      case 'messages': return <ViewMessages />;
      case 'team': return <ManageTeam />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {userProfile?.name || 'Admin'}</p>
          </div>
          <button onClick={signOut} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
            Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('opportunities')} className={`...`}>Post Opportunity</button>
            {/* New Tab Button */}
            <button onClick={() => setActiveTab('manage-opps')} className={`...`}>Manage Opportunities</button>
            <button onClick={() => setActiveTab('messages')} className={`...`}>View Messages</button>
            <button onClick={() => setActiveTab('team')} className={`...`}>Manage Team</button>
          </nav>
        </div>
        <div>{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
