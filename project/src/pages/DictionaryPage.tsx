import React, { useState } from 'react';
import { Search, BookOpen, Play, Star, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface DictionaryEntry {
  id: string;
  word: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  isFavorite: boolean;
}

const mockEntries: DictionaryEntry[] = [
  {
    id: '1',
    word: 'Hello',
    description: 'A greeting gesture made by waving your hand.',
    category: 'Greetings',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/watch?v=SsLvqfTXo78',
    isFavorite: true
  },
  {
    id: '2',
    word: 'Thank you',
    description: 'Express gratitude by moving your hand from your lips outward.',
    category: 'Courtesy',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/watch?v=EPlhDhll9mw',
    isFavorite: false
  },
  {
    id: '3',
    word: 'Love',
    description: 'Cross both hands over your heart to show love.',
    category: 'Emotions',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=CTx7sP06ujU',
    isFavorite: true
  },
  {
    id: '4',
    word: 'Family',
    description: 'Form an “F” handshape with both hands to circle in front of your chest.',
    category: 'Relationships',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=VOnHnaNiVSM',
    isFavorite: false
  }
];

const categories = ['All', 'Greetings', 'Courtesy', 'Emotions', 'Relationships', 'Numbers', 'Colors'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

export const DictionaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [entries, setEntries] = useState<DictionaryEntry[]>(mockEntries);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch =
      entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || entry.difficulty === selectedDifficulty;
    const matchesFavorites = !showFavoritesOnly || entry.isFavorite;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorites;
  });

  const toggleFavorite = (id: string) => {
    setEntries(prev =>
      prev.map(entry => (entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry))
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Dictionary</h1>
        <p className="text-gray-600">Look up signs and learn proper techniques</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search for signs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              variant={showFavoritesOnly ? 'primary' : 'outline'}
              icon={Star}
            >
              Favorites
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map(entry => (
          <Card key={entry.id} hover>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{entry.word}</h3>
                  <span className="text-sm text-gray-500">{entry.category}</span>
                </div>
                <button
                  onClick={() => toggleFavorite(entry.id)}
                  className={`p-1 rounded ${
                    entry.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star className={`w-5 h-5 ${entry.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Video Placeholder */}
              <div className="relative bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                {entry.videoUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Play}
                    onClick={() => window.open(entry.videoUrl, '_blank')}
                  >
                    Play Demo
                  </Button>
                ) : (
                  <div className="text-gray-500 text-sm">No demo available</div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm">{entry.description}</p>

              {/* Difficulty & Learn More */}
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    entry.difficulty
                  )}`}
                >
                  {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
                </span>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No signs found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* Quick Access */}
      <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Can't find a sign?</h3>
          <p className="text-gray-600 mb-4">Request new signs or contribute to our dictionary</p>
          <div className="flex justify-center space-x-3">
            <Button variant="primary">Request Sign</Button>
            <Button variant="outline">Contribute</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
