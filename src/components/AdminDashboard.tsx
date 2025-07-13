import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostOpportunityForm from './PostOpportunityForm';
import ViewMessages from './ViewMessages';
import ManageTeam from './ManageTeam';
import ManageOpportunities from './ManageOpportunities';
import ManageUsers from './ManageUsers';
import ManageTestimonials from './ManageTestimonials';
import ManageSettings from './ManageSettings'; // Import the new component

const AdminDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('opportunities');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'opportunities': return <PostOpportunityForm />;
      case 'manage-opps': return <ManageOpportunities />;
      case 'messages': return <ViewMessages />;
      case 'team': return <ManageTeam />;
      case 'users': return <ManageUsers />;
      case 'testimonials': return <ManageTestimonials />;
      case 'settings': return <ManageSettings />; // New case for settings
      default: return null;
    }
  };

  const getTabClassName = (tabName: string) => {
    return `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
      activeTab === tabName
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;
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
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            <button onClick={() => setActiveTab('opportunities')} className={getTabClassName('opportunities')}>Post Opportunity</button>
            <button onClick={() => setActiveTab('manage-opps')} className={getTabClassName('manage-opps')}>Manage Opportunities</button>
            <button onClick={() => setActiveTab('messages')} className={getTabClassName('messages')}>View Messages</button>
            <button onClick={() => setActiveTab('team')} className={getTabClassName('team')}>Manage Team</button>
            <button onClick={() => setActiveTab('users')} className={getTabClassName('users')}>Manage Users</button>
            <button onClick={() => setActiveTab('testimonials')} className={getTabClassName('testimonials')}>Manage Testimonials</button>
            {/* New Tab Button */}
            <button onClick={() => setActiveTab('settings')} className={getTabClassName('settings')}>Site Settings</button>
          </nav>
        </div>
        <div>{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
