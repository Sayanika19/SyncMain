import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const VideoCallPage: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [joinMeetingId, setJoinMeetingId] = useState('');

  const generateMeetingId = () => {
    const id = Math.random().toString(36).substring(2, 12).toUpperCase();
    setMeetingId(id);
    return id;
  };

  const createMeeting = () => {
    const id = generateMeetingId();
    setMeetingId(id);
    setIsInCall(true);
  };

  const joinMeeting = () => {
    if (joinMeetingId.trim()) {
      const id = joinMeetingId.trim().toUpperCase();
      setMeetingId(id);
      setIsInCall(true);
    }
  };

  if (isInCall) {
    return (
      <div className="h-screen w-screen bg-black">
        <iframe
          src={`http://127.0.0.1:5000?meet=${meetingId}`}
          title="Flask Video App"
          className="w-full h-full border-none"
          allow="camera; microphone; fullscreen; display-capture"
        >
          Your browser does not support iframes or the Flask app failed to load.
        </iframe>
      </div>
    );
  }

  return (
    <div className="text-white p-10 min-h-screen bg-black text-center space-y-6">
      <h1 className="text-3xl font-bold">Video Calling</h1>
      <div className="max-w-md mx-auto space-y-4">
        <Button onClick={createMeeting} className="w-full">
          Start Meeting
        </Button>
        <Input
          value={joinMeetingId}
          onChange={(e) => setJoinMeetingId(e.target.value)}
          placeholder="Enter Meeting ID"
        />
        <Button
          onClick={joinMeeting}
          className="w-full"
          disabled={!joinMeetingId.trim()}
        >
          Join Meeting
        </Button>
      </div>
    </div>
  );
};
