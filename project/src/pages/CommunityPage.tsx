import React, { useState } from 'react';
import { Users, MessageCircle, Heart, Share, Plus, Bookmark } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  category: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    avatar: '👩‍🦱',
    content: 'Just learned the sign for "beautiful"! The way it flows from the face in a circular motion is so elegant. Love how ASL can be so expressive! 🤟',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    isLiked: false,
    isBookmarked: true,
    category: 'Learning'
  },
  {
    id: '2',
    author: 'Mike Rodriguez',
    avatar: '👨‍🦲',
    content: 'Attended my first deaf community event today. The sense of belonging and warmth was incredible. Thank you to everyone who made me feel welcome! 💙',
    timestamp: '5 hours ago',
    likes: 67,
    comments: 15,
    isLiked: true,
    isBookmarked: false,
    category: 'Community'
  },
  {
    id: '3',
    author: 'Emma Johnson',
    avatar: '👩‍🦰',
    content: 'Quick tip: When fingerspelling, remember to keep your hand steady and form each letter clearly. Practice makes perfect! Who else is working on their fingerspelling speed?',
    timestamp: '1 day ago',
    likes: 45,
    comments: 12,
    isLiked: true,
    isBookmarked: true,
    category: 'Tips'
  }
];

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Learning', 'Community', 'Tips', 'Questions', 'Events'];

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const toggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">Connect with fellow sign language learners and deaf community members</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <Button icon={Plus}>
          New Post
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">2,847</p>
          <p className="text-sm text-gray-600">Community Members</p>
        </Card>
        
        <Card className="text-center">
          <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">1,234</p>
          <p className="text-sm text-gray-600">Posts This Month</p>
        </Card>
        
        <Card className="text-center">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">15,678</p>
          <p className="text-sm text-gray-600">Likes Given</p>
        </Card>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <div className="space-y-4">
              {/* Post Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                    {post.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Post Content */}
              <p className="text-gray-900 leading-relaxed">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-2 text-sm ${
                      post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-500">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
                
                <button
                  onClick={() => toggleBookmark(post.id)}
                  className={`p-1 rounded ${
                    post.isBookmarked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Community Guidelines */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="text-center">
          <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Guidelines</h3>
          <p className="text-gray-600 mb-4">
            Be respectful, inclusive, and supportive. Help create a welcoming space for everyone.
          </p>
          <Button variant="outline">
            Read Full Guidelines
          </Button>
        </div>
      </Card>
    </div>
  );
};