import React from 'react';
import { LogIn, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setCurrentSection }) => {
  const { user, signIn, signOut, loading } = useAuth();

  const navItems = ['home', 'opportunities', 'about', 'team', 'contact'];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/LOGO_KDKR.png" alt="OUR KANDUKUR Logo" className="h-8 w-auto" />
            <span className="ml-2 text-lg font-bold text-gray-800">OUR KANDUKUR</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setCurrentSection(item)}
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
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900">
              <Bell size={20} />
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    {/* FIXED: The image is now a button that navigates to the profile page */}
                    <button 
                      onClick={() => setCurrentSection('profile')} 
                      className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label="View Profile"
                    >
                      <img 
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} 
                        alt={user.displayName || 'User'} 
                        className="h-8 w-8 rounded-full" 
                        referrerPolicy="no-referrer"
                      />
                    </button>
                    <button 
                      onClick={signOut}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={signIn}
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <LogIn size={16} className="mr-2" />
                    Sign In
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
