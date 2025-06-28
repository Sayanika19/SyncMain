import React from 'react';
import { Link } from 'react-router-dom';
import { Hand, MessageSquare, BookOpen, Users, Mic, Settings, TrendingUp, Clock, Video } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const quickActions = [
  {
    title: 'Sign to Speech',
    description: 'Convert sign language to spoken words',
    icon: Hand,
    path: '/sign-to-speech',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    title: 'Text to Sign',
    description: 'See text converted to sign language',
    icon: Mic,
    path: '/text-to-sign',
    color: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600'
  },
  {
    title: 'Video Call',
    description: 'Video calls with live sign translation',
    icon: Video,
    path: '/video-call',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  {
    title: 'AI Assistant',
    description: 'Get help with sign language questions',
    icon: MessageSquare,
    path: '/ai-chat',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  },
  {
    title: 'Sign Dictionary',
    description: 'Look up signs and their meanings',
    icon: BookOpen,
    path: '/dictionary',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600'
  },
  {
    title: 'Community',
    description: 'Connect with other users',
    icon: Users,
    path: '/community',
    color: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600'
  }
];

const stats = [
  { label: 'Signs Learned', value: '127', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Practice Time', value: '2.5h', icon: Clock, color: 'text-blue-600' },
  { label: 'Video Calls', value: '8', icon: Video, color: 'text-purple-600' }
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Ready to continue your sign language journey? Let's break down communication barriers together.
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card hover className="h-full">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${action.color} text-white mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-gray-900">Joined video call with Sarah Chen</p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-gray-900">Completed "Basic Greetings" lesson</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <p className="text-gray-900">Asked AI assistant about fingerspelling</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Hand className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Tip</h3>
            <p className="text-gray-700">
              Use video calls with live translation to practice with hearing friends and family. 
              It's a great way to build confidence and improve your signing skills!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};