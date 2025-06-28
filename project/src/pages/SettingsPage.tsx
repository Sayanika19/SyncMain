import React, { useState } from 'react';
import { Settings, User, Shield, Accessibility, Bell, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const handleProfileUpdate = (field: string, value: string) => {
    updateUser({ [field]: value });
  };

  const handleAccessibilityUpdate = (setting: string, value: any) => {
    if (user?.accessibilitySettings) {
      updateUser({
        accessibilitySettings: {
          ...user.accessibilitySettings,
          [setting]: value
        }
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={user?.name || ''}
                onChange={(e) => handleProfileUpdate('name', e.target.value)}
              />
              
              <Input
                label="Email Address"
                type="email"
                value={user?.email || ''}
                onChange={(e) => handleProfileUpdate('email', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Preference
              </label>
              <div className="space-y-2">
                {[
                  { value: 'deaf', label: 'I am deaf' },
                  { value: 'mute', label: 'I am mute' },
                  { value: 'both', label: 'I am deaf and mute' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="preferredMode"
                      value={option.value}
                      checked={user?.preferredMode === option.value}
                      onChange={(e) => handleProfileUpdate('preferredMode', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Sign Language
              </label>
              <select
                value={user?.preferredLanguage || 'ASL'}
                onChange={(e) => handleProfileUpdate('preferredLanguage', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ASL">American Sign Language (ASL)</option>
                <option value="ISL">International Sign Language (ISL)</option>
                <option value="BSL">British Sign Language (BSL)</option>
                <option value="JSL">Japanese Sign Language (JSL)</option>
              </select>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Accessibility Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Size: {user?.accessibilitySettings?.textSize || 'medium'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={['small', 'medium', 'large', 'extra-large'].indexOf(user?.accessibilitySettings?.textSize || 'medium')}
                  onChange={(e) => {
                    const sizes = ['small', 'medium', 'large', 'extra-large'];
                    handleAccessibilityUpdate('textSize', sizes[parseInt(e.target.value)]);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                  <span>Extra Large</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contrast Mode
                </label>
                <select
                  value={user?.accessibilitySettings?.contrastMode || 'normal'}
                  onChange={(e) => handleAccessibilityUpdate('contrastMode', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Contrast</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Blind Support
                </label>
                <select
                  value={user?.accessibilitySettings?.colorBlindMode || 'none'}
                  onChange={(e) => handleAccessibilityUpdate('colorBlindMode', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="protanopia">Protanopia</option>
                  <option value="deuteranopia">Deuteranopia</option>
                  <option value="tritanopia">Tritanopia</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user?.accessibilitySettings?.vibrateOnNotifications || false}
                    onChange={(e) => handleAccessibilityUpdate('vibrateOnNotifications', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Vibrate on notifications</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user?.accessibilitySettings?.reduceMotion || false}
                    onChange={(e) => handleAccessibilityUpdate('reduceMotion', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Reduce motion</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user?.accessibilitySettings?.screenReaderOptimized || false}
                    onChange={(e) => handleAccessibilityUpdate('screenReaderOptimized', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Screen reader optimized</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">New Messages</h3>
                  <p className="text-sm text-gray-500">Get notified when someone sends you a message</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Community Activity</h3>
                  <p className="text-sm text-gray-500">Updates from community posts and discussions</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Learning Reminders</h3>
                  <p className="text-sm text-gray-500">Daily practice reminders and learning tips</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Language & Region</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Language
                </label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Profile Visibility</h3>
                  <p className="text-sm text-gray-500">Who can see your profile and activity</p>
                </div>
                <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                  <option>Public</option>
                  <option>Community Only</option>
                  <option>Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Data Collection</h3>
                  <p className="text-sm text-gray-500">Allow app to collect usage data for improvements</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your GestureTalk experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            {renderTabContent()}
            
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <Button>
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};