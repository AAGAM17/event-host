import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  Trophy,
  Clock,
  Grid,
  List,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input, Textarea } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

// API base URL
const API_BASE = 'http://localhost:5000';

// Event type from backend
type Event = {
  _id: string;
  title: string;
  description: string;
  theme: string;
  type: 'online' | 'offline' | 'hybrid';
  status?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  currentParticipants?: number;
  maxParticipants: number;
  location: string;
  imageUrl?: string;
  prizes: string[];
  tracks: string[];
  organizers: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const themes = ['All', 'Innovation & Technology', 'Sustainability', 'Healthcare', 'Blockchain & Web3', 'AI & Social Impact', 'Financial Technology'];
const types = ['All', 'Online', 'Offline', 'Hybrid'];


export const EventsPage: React.FC = () => {
  const { isAuthenticated, isOrganizer } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Event creation form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    theme: '',
    type: 'online' as const,
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxParticipants: 100,
    location: '',
    imageUrl: '',
    organizers: [''],
    tracks: [''],
    prizes: ['']
  });

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please login first');
        return;
      }

      const response = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const createdEvent = await response.json();
      setEvents(prev => [createdEvent, ...prev]);
      setShowCreateForm(false);
      setNewEvent({
        title: '',
        description: '',
        theme: '',
        type: 'online',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        maxParticipants: 100,
        location: '',
        imageUrl: '',
        organizers: [''],
        tracks: [''],
        prizes: ['']
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) return 'primary';
    if (now >= startDate && now <= endDate) return 'success';
    return 'secondary';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'All' || event.theme === selectedTheme;
    const matchesType = selectedType === 'All' || event.type === selectedType.toLowerCase();
    
    return matchesSearch && matchesTheme && matchesType;
  });

  const EventCard: React.FC<{ event: Event }> = ({ event }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant={getStatusColor(event)} className="capitalize">
            {getStatusColor(event) === 'primary' ? 'upcoming' : 
             getStatusColor(event) === 'success' ? 'ongoing' : 'completed'}
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
            <Badge variant="secondary" size="sm">{event.theme}</Badge>
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
            {event.currentParticipants || 0} / {event.maxParticipants} participants
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
            <span>{Math.round(((event.currentParticipants || 0) / event.maxParticipants) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ 
                width: `${Math.min(((event.currentParticipants || 0) / event.maxParticipants) * 100, 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Tracks */}
        {event.tracks.length > 0 && (
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
        )}

        {/* Organizers */}
        {event.organizers.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Organized by:</p>
            <p className="text-sm text-gray-600">{event.organizers.join(', ')}</p>
          </div>
        )}

        {/* Prizes and Action */}
        {event.prizes.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">
                {event.prizes[0]}
              </span>
            </div>
            <Button size="sm">
              <Link to={`/events/${event._id}`}>View Details</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <Button onClick={fetchEvents}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Discover Amazing Hackathons
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Join hackathons from around the world. Build, compete, and connect with fellow innovators.
            </p>
          </div>
          {isAuthenticated && isOrganizer && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      {/* Create Event Form - Only for organizers */}
      {showCreateForm && isAuthenticated && isOrganizer && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Event Title*"
                placeholder="e.g., SynapHack 3.0"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                label="Theme"
                placeholder="e.g., Innovation & Technology"
                value={newEvent.theme}
                onChange={(e) => setNewEvent(prev => ({ ...prev, theme: e.target.value }))}
              />
            </div>
            
            <Textarea
              label="Description*"
              placeholder="Describe your hackathon..."
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Start Date*"
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <Input
                label="End Date*"
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
              />
              <Input
                label="Registration Deadline*"
                type="date"
                value={newEvent.registrationDeadline}
                onChange={(e) => setNewEvent(prev => ({ ...prev, registrationDeadline: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Max Participants"
                type="number"
                value={newEvent.maxParticipants}
                onChange={(e) => setNewEvent(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 100 }))}
              />
              <Input
                label="Location"
                placeholder="e.g., Virtual, San Francisco"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={createEvent} disabled={!newEvent.title || !newEvent.description}>
                Create Event
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
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
