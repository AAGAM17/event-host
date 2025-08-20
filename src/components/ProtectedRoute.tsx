import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOrganizer?: boolean;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requireOrganizer = false 
}) => {
  const { isAuthenticated, isOrganizer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOrganizer && !isOrganizer) {
    // Redirect to dashboard if not organizer
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
