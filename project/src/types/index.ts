export interface User {
  id: string;
  email: string;
  name: string;
  preferredMode: 'deaf' | 'mute' | 'both';
  preferredLanguage: 'ASL' | 'ISL' | 'BSL' | 'JSL';
  accessibilitySettings: AccessibilitySettings;
}

export interface AccessibilitySettings {
  textSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrastMode: 'normal' | 'high';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  vibrateOnNotifications: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'sign' | 'audio';
}

export interface GestureEntry {
  id: string;
  word: string;
  description: string;
  videoUrl?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}