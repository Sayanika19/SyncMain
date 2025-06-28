import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useAuth } from '../../contexts/AuthContext';

export const Layout: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pb-16 md:pb-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};