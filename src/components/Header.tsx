import React, { useState, useEffect, useRef } from 'react';
import { LogIn, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setCurrentSection }) => {
  const { user, signIn, signOut, loading } = useAuth();
  const { notifications } = useNotifications();
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  // This effect calculates the number of unread notifications
  useEffect(() => {
    // Get the timestamp of the last notification the user saw
    const lastReadTimestamp = Number(localStorage.getItem('lastReadNotificationTimestamp') || 0);
    if (notifications.length > 0) {
        const newNotifications = notifications.filter(n => n.createdAt.seconds > lastReadTimestamp);
        setUnreadCount(newNotifications.length);
    }
  }, [notifications]);

  // This effect handles closing the panel if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [headerRef]);


  const handleBellClick = () => {
    setIsPanelOpen(!isPanelOpen);
    // If there are notifications, mark them as read by saving the timestamp of the newest one
    if (notifications.length > 0) {
        localStorage.setItem('lastReadNotificationTimestamp', String(notifications[0].createdAt.seconds));
        setUnreadCount(0); // Reset the visual counter
    }
  };

  const navItems = ['home', 'opportunities', 'about', 'team', 'contact'];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm" ref={headerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/LOGO_KDKR.png" alt="OUR KANDUKUR Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="ml-3 text-lg font-bold text-gray-800">OUR KANDUKUR</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button key={item} onClick={() => setCurrentSection(item)} className={`capitalize text-base font-medium transition-colors ${currentSection === item ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>{item}</button>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
                <button onClick={handleBellClick} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                    <Bell size={20} />
                </button>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white pointer-events-none">
                        {unreadCount}
                    </span>
                )}
                {isPanelOpen && <NotificationsPanel />}
            </div>
            
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentSection('profile')} className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="View Profile">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
