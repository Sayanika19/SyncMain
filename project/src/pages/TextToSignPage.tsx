import React, { useState } from 'react';
import { Type, Play, Pause, RotateCcw, Download, Volume2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const TextToSignPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentWord, setCurrentWord] = useState('');

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      // Simulate sign animation
      setCurrentWord('Hello');
      setTimeout(() => setCurrentWord(''), 3000);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      handleTextSubmit();
    }
  };

  const speakText = () => {
    if (inputText && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(inputText);
      speechSynthesis.speak(utterance);
    }
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentWord('');
  };

  const downloadVideo = () => {
    // Simulate video download
    console.log('Downloading sign language video...');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Text to Sign</h1>
        <p className="text-gray-600">Convert text into sign language animations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Enter Text</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text to Convert
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter the text you want to convert to sign language..."
                  rows={6}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleTextSubmit}
                  size="lg"
                  icon={Type}
                  disabled={!inputText.trim()}
                >
                  Generate Signs
                </Button>
                
                <Button
                  onClick={speakText}
                  variant="outline"
                  size="lg"
                  icon={Volume2}
                  disabled={!inputText.trim()}
                >
                  Speak
                </Button>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Playback Controls</h3>
              
              <div className="flex items-center space-x-4">
                <Button
                  onClick={togglePlayback}
                  variant="secondary"
                  icon={isPlaying ? Pause : Play}
                  disabled={!inputText.trim()}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <Button
                  onClick={resetAnimation}
                  variant="outline"
                  icon={RotateCcw}
                >
                  Reset
                </Button>
                
                <Button
                  onClick={downloadVideo}
                  variant="outline"
                  icon={Download}
                  disabled={!inputText.trim()}
                >
                  Download
                </Button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Playback Speed: {playbackSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.25"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>2x</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Animation Panel */}
        <Card>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Sign Animation</h2>
            
            {/* 3D Avatar Area */}
            <div className="relative bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
              {currentWord ? (
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <span className="text-white text-4xl">🤟</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    Signing: "{currentWord}"
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    3D avatar animation would appear here
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Type className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Enter text to see sign animation</p>
                  <p className="text-sm mt-1">3D avatar will demonstrate the signs</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isPlaying && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>0:03 / 0:10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-1/3 transition-all duration-300"></div>
                </div>
              </div>
            )}

            {/* Sign Information */}
            {currentWord && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Current Sign: "{currentWord}"</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use dominant hand</li>
                  <li>• Keep movements smooth</li>
                  <li>• Maintain eye contact</li>
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="text-center">
          <Type className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Text Input</h3>
          <p className="text-gray-600 text-sm">
            Type any text and see it converted to sign language
          </p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">3D Avatar</h3>
          <p className="text-gray-600 text-sm">
            Realistic 3D avatar demonstrates proper sign techniques
          </p>
        </Card>

        <Card className="text-center">
          <Download className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Video</h3>
          <p className="text-gray-600 text-sm">
            Download sign animations for offline viewing and sharing
          </p>
        </Card>
      </div>
    </div>
  );
};