import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AnnouncementBanner from './components/AnnouncementBanner';
import Header from './components/Header';
import Hero from './components/Hero';
import Opportunities from './components/Opportunities';
import About from './components/About';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <>
            <Hero setCurrentSection={setCurrentSection} />
            <Opportunities />
          </>
        );
      case 'opportunities':
        return <Opportunities />;
      case 'about':
        return <About />;
      case 'team':
        return <Team />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <>
            <Hero setCurrentSection={setCurrentSection} />
            <Opportunities />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AnnouncementBanner />
        <Header currentSection={currentSection} setCurrentSection={setCurrentSection} />
        <main>
          {renderSection()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;