import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  Trophy, 
  TrendingUp,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              EventHost
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            The ultimate platform for hosting and participating in hackathons, 
            tech events, and innovation challenges.
          </p>
      <section className="relative bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6">
              Host Epic Hackathons &
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Drive Innovation
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              The complete platform for organizing, participating, and judging hackathons. 
              Powered by Azure and built for scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Link to="/events" className="flex items-center">
                  Explore Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/create-event">Create Event</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Featured Hackathons
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing hackathons happening around the world. From AI/ML to sustainability, 
            find the perfect event to showcase your skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={getStatusColor(event.status) as any} className="capitalize">
                    {event.status}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="capitalize">
                    {event.type}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Event Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {event.currentParticipants} / {event.maxParticipants} participants
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Registration closes {formatDate(event.registrationDeadline)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Registration Progress</span>
                    <span>{Math.round((event.currentParticipants / (event.maxParticipants || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((event.currentParticipants / (event.maxParticipants || 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700 mb-6">
                Welcome back, <span className="font-semibold">{user?.name}</span>! 
                You're logged in as a <span className="font-semibold capitalize">{user?.role}</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/events">Browse Events</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                {user?.role === 'organizer' && (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/create-event">Create Event</Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Join thousands of developers, designers, and innovators
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Stay connected with live announcements, reminders, and Q&A sessions during events.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Polls & Surveys</h3>
            <p className="text-gray-600">Engage participants with instant polls and get real-time feedback during your events.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">Build teams, manage submissions, and collaborate seamlessly with your event participants.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join our community of innovators and start building amazing events today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
