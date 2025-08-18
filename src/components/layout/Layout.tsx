import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'participant' | 'organizer' | 'judge';
    avatar?: string;
  };
  notifications?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, notifications }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} notifications={notifications} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
