import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Hand, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  LogOut,
  Menu,
  X,
  Users,
  Mic,
  Video
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigationItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/sign-to-speech', icon: Hand, label: 'Sign to Speech' },
  { path: '/text-to-sign', icon: Mic, label: 'Text to Sign' },
  { path: '/video-call', icon: Video, label: 'Video Call' },
  { path: '/ai-chat', icon: MessageSquare, label: 'AI Assistant' },
  { path: '/dictionary', icon: BookOpen, label: 'Sign Dictionary' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink: React.FC<{ item: typeof navigationItems[0] }> = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        className={`
          flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon className="w-5 h-5 mr-3" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Hand className="w-8 h-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">GestureTalk</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex items-center px-6 py-6 border-b border-gray-200">
          <Hand className="w-8 h-8 text-blue-600 mr-3" />
          <span className="text-xl font-bold text-gray-900">GestureTalk</span>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>

        <div className="px-4 py-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center px-6 py-6 border-b border-gray-200 mt-16">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>

            <div className="px-4 py-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};