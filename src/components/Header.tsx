import React, { useState } from 'react';
import { LogIn, Bell, Menu, X } from 'lucide-react'; // Import Menu and X icons
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setCurrentSection }) => {
  const { user, signIn, signOut, loading } = useAuth();
  // State to manage the mobile menu's visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ['home', 'opportunities', 'about', 'team', 'contact'];

  const handleNavClick = (section: string) => {
    setCurrentSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src="/LOGO_KDKR.png" 
              alt="OUR KANDUKUR Logo" 
              className="h-10 w-10 rounded-full object-cover" 
            />
            <span className="ml-3 text-lg font-bold text-gray-800">OUR KANDUKUR</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`capitalize text-base font-medium transition-colors ${
                  currentSection === item
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                <Bell size={20} />
              </button>
              
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleNavClick('profile')} className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="View Profile">
                        <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer"/>
                      </button>
                      <button onClick={signOut} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Sign Out</button>
                    </div>
                  ) : (
                    <button onClick={signIn} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"><LogIn size={16} className="mr-2" />Sign In</button>
                  )}
                </>
              )}
            </div>

            {/* Hamburger Menu Button for Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                aria-label="Open main menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                  currentSection === item
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
             {/* Profile link for mobile */}
             {user && (
                <button
                    onClick={() => handleNavClick('profile')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                    currentSection === 'profile'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    Profile
                </button>
            )}
          </div>
          {/* Sign In/Out button for mobile */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2">
              {!loading && (
                <>
                  {user ? (
                     <button onClick={signOut} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">Sign Out</button>
                  ) : (
                    <button onClick={signIn} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"><LogIn size={16} className="mr-2" />Sign In</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
