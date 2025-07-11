import React from 'react';
import { Menu, X, Bell, User, LogOut, MessageCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import UserProfile from './auth/UserProfile';
import CommunityChat from './community/CommunityChat';
import AdminPanel from './admin/AdminPanel';

interface HeaderProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setCurrentSection }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [showAdminPanel, setShowAdminPanel] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { user, signOut, isAdmin } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'about', label: 'About' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' },
  ];

  const getTagColor = (tag: string) => {
    const colors = {
      user: 'bg-gray-100 text-gray-800',
      student: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800',
      founder: 'bg-purple-100 text-purple-800',
      teacher: 'bg-green-100 text-green-800',
      mentor: 'bg-orange-100 text-orange-800',
      vip: 'bg-yellow-100 text-yellow-800',
      manager: 'bg-indigo-100 text-indigo-800'
    }
    return colors[tag as keyof typeof colors] || colors.user
  }

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 float-animation">
              <div className="flex items-center space-x-3">
                <img 
                  src="/LOGO_KDKR.png" 
                  alt="OUR KANDUKUR Logo" 
                  className="w-10 h-10 rounded-lg object-contain bg-white p-1 shadow-md"
                />
                <div>
                  <h1 className="text-2xl font-bold text-blue-800">OUR KANDUKUR</h1>
                  <p className="text-xs text-gray-600">Startup Community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all btn-3d ${
                    currentSection === item.id
                      ? 'bg-blue-800 text-white neon-glow'
                      : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Community Chat Button */}
              <button 
                onClick={() => setShowChat(true)}
                className="p-2 text-gray-700 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                title="Community Chat"
              >
                <MessageCircle className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-700 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors" title="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(user.tag)}`}>
                        {user.tag}
                      </span>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          setShowProfile(true)
                          setShowUserMenu(false)
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setShowAdminPanel(true)
                            setShowUserMenu(false)
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Panel
                        </button>
                      )}
                      <button
                        onClick={() => {
                          signOut()
                          setShowUserMenu(false)
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentSection === item.id
                      ? 'bg-blue-800 text-white'
                      : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>

      {/* Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <CommunityChat isOpen={showChat} onClose={() => setShowChat(false)} />
      <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
    </>
  );
};

export default Header;