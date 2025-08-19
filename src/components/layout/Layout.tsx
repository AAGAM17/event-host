import React from 'react';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} isAuthenticated={isAuthenticated} onLogout={logout} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
