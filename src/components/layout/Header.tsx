import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
import { Link } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  Trophy,
  Users,
  BarChart3,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';


interface HeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'participant' | 'organizer' | 'judge';
    avatar?: string;
  } | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requireAuth: true },
    { name: 'Events', href: '/events', icon: Calendar, requireAuth: true },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy, requireAuth: true },
    { name: 'Team', href: '/team', icon: Users, requireAuth: true },
    { name: 'Communication', href: '/communication', icon: Bell, requireAuth: true },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsProfileOpen(false);
  };
  const organizerItems = [
    { name: 'Create Event', href: '/create-event' },
    { name: 'My Events', href: '/my-events' },
    { name: 'Analytics', href: '/analytics' },
  ];

  const profileItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Logout', href: '/logout', icon: LogOut },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              EventHost
            </Link>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                if (item.requireAuth && !isAuthenticated) return null;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {user?.role === 'organizer' && (
                <Link to="/create-event" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Create Event
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold font-heading">EventHost</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user?.role === 'organizer' && (
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-900 transition-colors">Organize</button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {organizerItems.map((item) => (
                    <Link key={item.name} to={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Search (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, teams, projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

            {/* User Actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Bell className="h-5 w-5" />
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {notifications > 9 ? '9+' : notifications}
                    </Badge>
                  )}
                </button>

                {/* Profile */}
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium">{user.name}</span>
                    <Badge variant="secondary" size="sm">{user.role}</Badge>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="mr-3 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/events"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        Events
                      </Link>
                      <hr className="my-1" />
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border py-1">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <Badge variant="secondary" size="sm" className="mt-1">{user.role}</Badge>
                      </div>
                      {profileItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.name} to={item.href} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2 px-4">
              {navItems.map((item) => {
                if (item.requireAuth && !isAuthenticated) return null;
                const Icon = item.icon;
                return (
                  <Link key={item.name} to={item.href} className="flex items-center space-x-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user?.role === 'organizer' && (
                <div className="pt-2 border-t border-gray-200">
                  <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Organizer
                  </h3>
                  <Link
                    to="/create-event"
                    className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    Create Event
                  </Link>
                  <Link
                    to="/manage-events"
                    className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    Manage Events
                  </Link>
                </div>
                <>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium text-gray-500 mb-2">Organize</p>
                    {organizerItems.map((item) => (
                      <Link key={item.name} to={item.href} className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Mobile Search */}
              <div className="pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {(isMenuOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}
    </header>
  );
};
