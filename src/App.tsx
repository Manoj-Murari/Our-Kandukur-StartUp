import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AnnouncementBanner from './components/AnnouncementBanner';
import Header from './components/Header';
import Hero from './components/Hero';
import Opportunities from './components/Opportunities';
import About from './components/About';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import { Loader2 } from 'lucide-react';

// This is the main view for logged-out users or job seekers
const JobSeekerView: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('home');

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (<><Hero setCurrentSection={setCurrentSection} /><Opportunities /></>);
      case 'opportunities':
        return <Opportunities />;
      case 'about':
        return <About />;
      case 'team':
        return <Team />;
      case 'contact':
        return <Contact />;
      case 'profile':
        return <Profile />;
      default:
        return (<><Hero setCurrentSection={setCurrentSection} /><Opportunities /></>);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBanner />
      <Header currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <main>{renderSection()}</main>
      <Footer />
    </div>
  );
}

// This component decides which view to show
const AppRouter: React.FC = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Check the user's role and render the correct component
  if (userProfile?.role === 'admin') {
    return <AdminDashboard />;
  }
  
  if (userProfile?.role === 'recruiter') {
    return <RecruiterDashboard />;
  }

  // Default to the Job Seeker view
  return <JobSeekerView />;
};

// The main App component now just wraps the router in the AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
