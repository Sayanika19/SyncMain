import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, preferredMode: User['preferredMode'], preferredLanguage: User['preferredLanguage']) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('gesturetalk_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('gesturetalk_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from your backend
      const userData: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        preferredMode: 'both',
        preferredLanguage: 'ASL',
        accessibilitySettings: {
          textSize: 'medium',
          contrastMode: 'normal',
          colorBlindMode: 'none',
          vibrateOnNotifications: true,
          reduceMotion: false,
          screenReaderOptimized: false,
        }
      };
      
      setUser(userData);
      localStorage.setItem('gesturetalk_user', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, preferredMode: User['preferredMode'], preferredLanguage: User['preferredLanguage']) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        preferredMode,
        preferredLanguage,
        accessibilitySettings: {
          textSize: 'medium',
          contrastMode: 'normal',
          colorBlindMode: 'none',
          vibrateOnNotifications: true,
          reduceMotion: false,
          screenReaderOptimized: false,
        }
      };
      
      setUser(userData);
      localStorage.setItem('gesturetalk_user', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gesturetalk_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('gesturetalk_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};