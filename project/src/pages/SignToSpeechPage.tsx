import React, { useState, useRef, useCallback } from 'react';
import { Camera, Mic, Square, Play, Pause, Download, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SignToSpeechPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  React.useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate gesture recognition
      setTimeout(() => {
        setDetectedText("Hello, how are you today?");
        setConfidence(0.92);
      }, 2000);
    }
  };

  const speakText = () => {
    if (detectedText && 'speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(detectedText);
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const downloadTranscript = () => {
    if (detectedText) {
      const blob = new Blob([detectedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sign-to-speech-transcript.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign to Speech</h1>
        <p className="text-gray-600">Convert your sign language to spoken words and text</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Camera Feed</h2>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              
              {/* Recording Overlay */}
              {isRecording && (
                <div className="absolute inset-0 border-4 border-red-500 animate-pulse">
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    REC
                  </div>
                </div>
              )}

              {/* Gesture Detection Overlay */}
              {isRecording && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full">
                    {/* Hand landmark points simulation */}
                    <circle cx="200" cy="150" r="3" fill="#00ff00" opacity="0.8" />
                    <circle cx="220" cy="140" r="3" fill="#00ff00" opacity="0.8" />
                    <circle cx="240" cy="130" r="3" fill="#00ff00" opacity="0.8" />
                    <circle cx="260" cy="120" r="3" fill="#00ff00" opacity="0.8" />
                    <circle cx="280" cy="110" r="3" fill="#00ff00" opacity="0.8" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={toggleRecording}
                variant={isRecording ? 'danger' : 'primary'}
                size="lg"
                icon={isRecording ? Square : Camera}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              
              <Button
                onClick={startCamera}
                variant="outline"
                size="lg"
                icon={RefreshCw}
              >
                Reset Camera
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Panel */}
        <Card>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Recognition Results</h2>
            
            {/* Detected Text */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Detected Text
              </label>
              <div className="min-h-24 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                {detectedText ? (
                  <p className="text-gray-900">{detectedText}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    Start recording to see detected signs...
                  </p>
                )}
              </div>
            </div>

            {/* Confidence Score */}
            {confidence > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Confidence</span>
                  <span className="text-gray-900 font-medium">{Math.round(confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={isPlaying ? stopSpeaking : speakText}
                variant="secondary"
                size="lg"
                className="w-full"
                icon={isPlaying ? Pause : Play}
                disabled={!detectedText}
              >
                {isPlaying ? 'Stop Speaking' : 'Speak Text'}
              </Button>

              <Button
                onClick={downloadTranscript}
                variant="outline"
                size="lg"
                className="w-full"
                icon={Download}
                disabled={!detectedText}
              >
                Download Transcript
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for Better Recognition</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting on your hands</li>
                <li>• Keep hands within the camera frame</li>
                <li>• Sign at a moderate pace</li>
                <li>• Face the camera directly</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="text-center">
          <Camera className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Detection</h3>
          <p className="text-gray-600 text-sm">
            Advanced AI recognizes sign language gestures in real-time
          </p>
        </Card>

        <Card className="text-center">
          <Mic className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Speech Output</h3>
          <p className="text-gray-600 text-sm">
            Convert detected signs to natural-sounding speech
          </p>
        </Card>

        <Card className="text-center">
          <Download className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Save & Share</h3>
          <p className="text-gray-600 text-sm">
            Download transcripts and share your conversations
          </p>
        </Card>
      </div>
    </div>
  );
};