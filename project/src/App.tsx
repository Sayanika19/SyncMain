import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { SignToSpeechPage } from './pages/SignToSpeechPage';
import { TextToSignPage } from './pages/TextToSignPage';
import { AIChatPage } from './pages/AIChatPage';
import { DictionaryPage } from './pages/DictionaryPage';
import { CommunityPage } from './pages/CommunityPage';
import { VideoCallPage } from './pages/VideoCallPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/sign-to-speech" element={
              <ProtectedRoute>
                <SignToSpeechPage />
              </ProtectedRoute>
            } />
            <Route path="/text-to-sign" element={
              <ProtectedRoute>
                <TextToSignPage />
              </ProtectedRoute>
            } />
            <Route path="/ai-chat" element={
              <ProtectedRoute>
                <AIChatPage />
              </ProtectedRoute>
            } />
            <Route path="/dictionary" element={
              <ProtectedRoute>
                <DictionaryPage />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            <Route path="/video-call" element={
              <ProtectedRoute>
                <VideoCallPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;