import React, { createContext, useContext, useEffect, useState } from 'react';

import type { AuthUser } from '../types';

type User = AuthUser;

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const userRole = localStorage.getItem('user_role');
    const userName = localStorage.getItem('user_name');
    const userId = localStorage.getItem('user_id');

    if (token && userRole && userName && userId) {
      setUser({
        id: userId,
        name: userName,
  email: '', // We don't store email in localStorage for security
  role: userRole as 'participant' | 'organizer' | 'judge',
  isEmailVerified: false,
      });
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_role', userData.role);
    localStorage.setItem('user_name', userData.name);
    localStorage.setItem('user_id', userData.id);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isOrganizer: user?.role === 'organizer',
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
