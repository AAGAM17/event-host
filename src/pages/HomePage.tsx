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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// Mock data
const featuredEvents = [
  {
    id: '1',
    title: 'SynapHack 3.0',
    description: 'Build the future of innovation with cutting-edge technology',
    theme: 'Innovation & Technology',
    type: 'hybrid' as const,
    status: 'upcoming' as const,
    startDate: new Date('2024-09-15'),
    endDate: new Date('2024-09-17'),
    registrationDeadline: new Date('2024-09-10'),
    currentParticipants: 847,
    maxParticipants: 1000,
    location: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop',
    prizes: ['$10,000', '$5,000', '$2,500'],
    tracks: ['AI/ML', 'Web3', 'FinTech', 'Healthcare']
  },
  {
    id: '2',
    title: 'EcoHack 2024',
    description: 'Sustainable solutions for a better tomorrow',
    theme: 'Sustainability',
    type: 'online' as const,
    status: 'ongoing' as const,
    startDate: new Date('2024-08-20'),
    endDate: new Date('2024-08-22'),
    registrationDeadline: new Date('2024-08-15'),
    currentParticipants: 623,
    maxParticipants: 800,
    location: 'Virtual',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
    prizes: ['$8,000', '$4,000', '$2,000'],
    tracks: ['Clean Energy', 'Agriculture', 'Climate Tech', 'Waste Management']
  },
  {
    id: '3',
    title: 'HealthTech Innovation',
    description: 'Revolutionizing healthcare through technology',
    theme: 'Healthcare',
    type: 'offline' as const,
    status: 'upcoming' as const,
    startDate: new Date('2024-09-25'),
    endDate: new Date('2024-09-27'),
    registrationDeadline: new Date('2024-09-20'),
    currentParticipants: 342,
    maxParticipants: 500,
    location: 'Boston, MA',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop',
    prizes: ['$12,000', '$6,000', '$3,000'],
    tracks: ['Digital Health', 'Medical Devices', 'Biotechnology', 'Telemedicine']
  }
];

const stats = [
  { label: 'Total Events', value: '150+', icon: Calendar },
  { label: 'Active Participants', value: '25,000+', icon: Users },
  { label: 'Projects Submitted', value: '5,400+', icon: Trophy },
  { label: 'Success Rate', value: '94%', icon: TrendingUp },
];

const features = [
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Create and launch your hackathon in minutes with our intuitive interface'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Enterprise-grade security with Azure cloud infrastructure'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Host online, offline, or hybrid events for participants worldwide'
  }
];

export const HomePage: React.FC = () => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'success';
      case 'upcoming': return 'primary';
      case 'completed': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
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

                {/* Tracks */}
                <div>
                  <p className="text-sm font-medium mb-2">Tracks:</p>
                  <div className="flex flex-wrap gap-1">
                    {event.tracks.slice(0, 3).map((track, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {track}
                      </Badge>
                    ))}
                    {event.tracks.length > 3 && (
                      <Badge variant="secondary" size="sm">
                        +{event.tracks.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Prizes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">
                      Prize Pool: {event.prizes[0]}
                    </span>
                  </div>
                  <Button size="sm">
                    <Link to={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            <Link to="/events" className="flex items-center">
              View All Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Why Choose EventHost?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern technology stack and enterprise-grade infrastructure 
              to deliver exceptional hackathon experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Host Your Hackathon?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of organizers who trust EventHost to deliver exceptional 
            hackathon experiences. Start creating your event today.
          </p>
          <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            <Link to="/create-event" className="flex items-center">
              Create Your Event
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
