import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const stats = [
  { icon: Calendar, value: '50+', label: 'Events Hosted' },
  { icon: Users, value: '10K+', label: 'Participants' },
  { icon: Clock, value: '24/7', label: 'Support' },
  { icon: MapPin, value: 'Global', label: 'Reach' },
];

const featuredEvents = [
  {
    id: 1,
    imageUrl: '/path/to/image.jpg',
    title: 'Hackathon 2023',
    description: 'An exciting hackathon event.',
    startDate: '2023-10-01',
    endDate: '2023-10-03',
    location: 'New York',
    currentParticipants: 100,
    maxParticipants: 200,
    registrationDeadline: '2023-09-25',
    status: 'open',
    type: 'hackathon',
  },
];

const formatDate = (date: string): string => new Date(date).toLocaleDateString();
const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' => {
  switch (status) {
    case 'open':
      return 'success';
    case 'closed':
      return 'destructive';
    case 'upcoming':
      return 'warning';
    default:
      return 'secondary';
  }
};

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
        </div>
      </div>

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
                  <Badge variant={getStatusColor(event.status)} className="capitalize">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
