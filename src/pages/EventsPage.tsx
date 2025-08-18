import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  MapPin, 
  Trophy,
  Clock,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock data - would be replaced with API call
const events = [
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
    tracks: ['AI/ML', 'Web3', 'FinTech', 'Healthcare'],
    organizers: ['TechCorp', 'Innovation Hub']
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
    tracks: ['Clean Energy', 'Agriculture', 'Climate Tech', 'Waste Management'],
    organizers: ['GreenTech Foundation']
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
    tracks: ['Digital Health', 'Medical Devices', 'Biotechnology', 'Telemedicine'],
    organizers: ['MedTech Alliance', 'Harvard Medical']
  },
  {
    id: '4',
    title: 'Web3 Builders Summit',
    description: 'Building the decentralized future',
    theme: 'Blockchain & Web3',
    type: 'hybrid' as const,
    status: 'upcoming' as const,
    startDate: new Date('2024-10-05'),
    endDate: new Date('2024-10-07'),
    registrationDeadline: new Date('2024-09-30'),
    currentParticipants: 234,
    maxParticipants: 600,
    location: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop',
    prizes: ['$15,000', '$8,000', '$4,000'],
    tracks: ['DeFi', 'NFTs', 'DAOs', 'Infrastructure'],
    organizers: ['Web3 Foundation', 'Blockchain Labs']
  },
  {
    id: '5',
    title: 'AI for Good Challenge',
    description: 'Using artificial intelligence to solve world problems',
    theme: 'AI & Social Impact',
    type: 'online' as const,
    status: 'completed' as const,
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-07-17'),
    registrationDeadline: new Date('2024-07-10'),
    currentParticipants: 956,
    maxParticipants: 1000,
    location: 'Virtual',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
    prizes: ['$20,000', '$10,000', '$5,000'],
    tracks: ['Education', 'Environment', 'Healthcare', 'Social Justice'],
    organizers: ['AI Ethics Institute', 'Global Impact Fund']
  },
  {
    id: '6',
    title: 'FinTech Revolution',
    description: 'Reimagining the future of finance',
    theme: 'Financial Technology',
    type: 'offline' as const,
    status: 'upcoming' as const,
    startDate: new Date('2024-11-10'),
    endDate: new Date('2024-11-12'),
    registrationDeadline: new Date('2024-11-05'),
    currentParticipants: 123,
    maxParticipants: 400,
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=300&fit=crop',
    prizes: ['$18,000', '$9,000', '$4,500'],
    tracks: ['Digital Banking', 'Payments', 'Trading', 'RegTech'],
    organizers: ['FinTech Accelerator', 'NYSE']
  }
];

const themes = ['All', 'Innovation & Technology', 'Sustainability', 'Healthcare', 'Blockchain & Web3', 'AI & Social Impact', 'Financial Technology'];
const types = ['All', 'Online', 'Offline', 'Hybrid'];
const statuses = ['All', 'Upcoming', 'Ongoing', 'Completed'];

export const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'All' || event.theme === selectedTheme;
    const matchesType = selectedType === 'All' || event.type === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesTheme && matchesType && matchesStatus;
  });

  const EventCard: React.FC<{ event: typeof events[0] }> = ({ event }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
            <CardDescription className="mb-3">{event.description}</CardDescription>
            <Badge variant="outline" size="sm">{event.theme}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            {event.location}
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            {event.currentParticipants} / {event.maxParticipants} participants
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
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

        {/* Organizers */}
        <div>
          <p className="text-sm font-medium mb-1">Organized by:</p>
          <p className="text-sm text-gray-600">{event.organizers.join(', ')}</p>
        </div>

        {/* Prizes and Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">
              {event.prizes[0]}
            </span>
          </div>
          <Button size="sm">
            <Link to={`/events/${event.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EventListItem: React.FC<{ event: typeof events[0] }> = ({ event }) => (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(event.status) as any} className="capitalize">
                  {event.status}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {event.type}
                </Badge>
                <Badge variant="outline" size="sm">{event.theme}</Badge>
              </div>
            </div>
            <Button size="sm">
              <Link to={`/events/${event.id}`}>View Details</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(event.startDate)}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {event.location}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {event.currentParticipants} participants
            </div>
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              {event.prizes[0]}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {event.tracks.slice(0, 4).map((track, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {track}
                </Badge>
              ))}
              {event.tracks.length > 4 && (
                <Badge variant="secondary" size="sm">
                  +{event.tracks.length - 4} more
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              by {event.organizers.join(', ')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Discover Amazing Hackathons
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Join hackathons from around the world. Build, compete, and connect with fellow innovators.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search events, themes, locations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>

      {/* Events Grid/List */}
      {filteredEvents.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredEvents.map((event) => 
            viewMode === 'grid' ? (
              <EventCard key={event.id} event={event} />
            ) : (
              <EventListItem key={event.id} event={event} />
            )
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more events.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedTheme('All');
                setSelectedType('All');
                setSelectedStatus('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
