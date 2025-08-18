import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Bell, 
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Target,
  Activity,
  BarChart3,
  PlusCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// Mock data based on user role
const userData = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'participant' as const, // Change to 'organizer' or 'judge' to see different views
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
};

const participantData = {
  stats: {
    eventsParticipated: 8,
    projectsSubmitted: 6,
    awardsWon: 3,
    teamsJoined: 5
  },
  currentEvents: [
    {
      id: '1',
      title: 'SynapHack 3.0',
      status: 'ongoing' as const,
      endDate: new Date('2024-09-17'),
      teamName: 'Innovation Squad',
      trackName: 'AI/ML',
      progress: 75
    }
  ],
  recentAchievements: [
    {
      id: '1',
      title: 'First Place Winner',
      event: 'EcoHack 2024',
      date: new Date('2024-08-22'),
      type: 'gold' as const
    },
    {
      id: '2',
      title: 'Best Technical Implementation',
      event: 'HealthTech Innovation',
      date: new Date('2024-07-15'),
      type: 'special' as const
    }
  ],
  upcomingDeadlines: [
    {
      id: '1',
      title: 'Project Submission',
      event: 'SynapHack 3.0',
      deadline: new Date('2024-09-17T23:59:59'),
      type: 'submission' as const
    },
    {
      id: '2',
      title: 'Registration Closes',
      event: 'FinTech Revolution',
      deadline: new Date('2024-11-05T23:59:59'),
      type: 'registration' as const
    }
  ]
};

const organizerData = {
  stats: {
    eventsCreated: 12,
    totalParticipants: 2450,
    activeEvents: 3,
    completedEvents: 9
  },
  activeEvents: [
    {
      id: '1',
      title: 'SynapHack 3.0',
      participants: 847,
      maxParticipants: 1000,
      submissions: 156,
      status: 'ongoing' as const,
      endDate: new Date('2024-09-17')
    },
    {
      id: '2',
      title: 'FinTech Revolution',
      participants: 123,
      maxParticipants: 400,
      submissions: 0,
      status: 'upcoming' as const,
      startDate: new Date('2024-11-10')
    }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'new_registration',
      message: '15 new participants registered for SynapHack 3.0',
      timestamp: new Date('2024-08-16T14:30:00')
    },
    {
      id: '2',
      type: 'submission',
      message: '8 new project submissions received',
      timestamp: new Date('2024-08-16T12:15:00')
    }
  ]
};

const judgeData = {
  stats: {
    eventsJudged: 15,
    projectsEvaluated: 89,
    averageScore: 8.7,
    pendingEvaluations: 12
  },
  assignedEvents: [
    {
      id: '1',
      title: 'SynapHack 3.0',
      track: 'AI/ML',
      projectsToReview: 23,
      completedReviews: 11,
      deadline: new Date('2024-09-20')
    }
  ],
  recentEvaluations: [
    {
      id: '1',
      projectTitle: 'EcoTrack - Sustainable Habit Tracker',
      teamName: 'Innovation Squad',
      score: 87,
      status: 'completed' as const,
      date: new Date('2024-08-16')
    }
  ]
};

export const DashboardPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'participant' | 'organizer' | 'judge'>(userData.role);

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_registration': return Users;
      case 'submission': return FileText;
      case 'message': return MessageSquare;
      default: return Activity;
    }
  };

  const renderParticipantDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{participantData.stats.eventsParticipated}</p>
                <p className="text-gray-600 text-sm">Events Participated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{participantData.stats.projectsSubmitted}</p>
                <p className="text-gray-600 text-sm">Projects Submitted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{participantData.stats.awardsWon}</p>
                <p className="text-gray-600 text-sm">Awards Won</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{participantData.stats.teamsJoined}</p>
                <p className="text-gray-600 text-sm">Teams Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Current Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participantData.currentEvents.length > 0 ? (
              <div className="space-y-4">
                {participantData.currentEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          Team: {event.teamName} • Track: {event.trackName}
                        </p>
                      </div>
                      <Badge variant={event.status === 'ongoing' ? 'success' : 'primary'}>
                        {event.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{event.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${event.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Ends: {event.endDate.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Link to={`/events/${event.id}`}>View Event</Link>
                      </Button>
                      <Button size="sm">
                        <Link to="/submission">Manage Submission</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active events</p>
                <Button className="mt-4">
                  <Link to="/events">Browse Events</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participantData.upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{deadline.title}</h4>
                    <p className="text-sm text-gray-600">{deadline.event}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {formatTimeRemaining(deadline.deadline)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deadline.deadline.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {participantData.recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  achievement.type === 'gold' ? 'bg-yellow-100' :
                  achievement.type === 'silver' ? 'bg-gray-100' :
                  achievement.type === 'bronze' ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  {achievement.type === 'gold' ? (
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <Star className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.event}</p>
                  <p className="text-xs text-gray-500">
                    {achievement.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrganizerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{organizerData.stats.eventsCreated}</p>
                <p className="text-gray-600 text-sm">Events Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{organizerData.stats.totalParticipants}</p>
                <p className="text-gray-600 text-sm">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{organizerData.stats.activeEvents}</p>
                <p className="text-gray-600 text-sm">Active Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{organizerData.stats.completedEvents}</p>
                <p className="text-gray-600 text-sm">Completed Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Active Events
              </CardTitle>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                <Link to="/create-event">Create Event</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizerData.activeEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge variant={event.status === 'ongoing' ? 'success' : 'primary'}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Participants</p>
                      <p className="font-medium">{event.participants}/{event.maxParticipants}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Submissions</p>
                      <p className="font-medium">{event.submissions}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button size="sm">
                      <Link to={`/events/${event.id}/manage`}>Manage</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {organizerData.recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Icon className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderJudgeDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{judgeData.stats.eventsJudged}</p>
                <p className="text-gray-600 text-sm">Events Judged</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{judgeData.stats.projectsEvaluated}</p>
                <p className="text-gray-600 text-sm">Projects Evaluated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{judgeData.stats.averageScore}</p>
                <p className="text-gray-600 text-sm">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{judgeData.stats.pendingEvaluations}</p>
                <p className="text-gray-600 text-sm">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Assigned Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Assigned Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {judgeData.assignedEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">Track: {event.track}</p>
                    </div>
                    <Badge variant="primary">Active</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Review Progress</span>
                      <span>{event.completedReviews}/{event.projectsToReview}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(event.completedReviews / event.projectsToReview) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Deadline: {event.deadline.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Button size="sm" className="mt-4 w-full">
                    Continue Judging
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Recent Evaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {judgeData.recentEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{evaluation.projectTitle}</h4>
                      <p className="text-xs text-gray-600">{evaluation.teamName}</p>
                      <p className="text-xs text-gray-500">
                        {evaluation.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success" size="sm">
                        {evaluation.score}/100
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back, {userData.name}! Here's what's happening.
            </p>
          </div>
          <Badge variant="primary" className="capitalize">
            {selectedRole}
          </Badge>
        </div>
      </div>

      {/* Role Switcher for Demo */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Demo: Switch Role</h3>
              <p className="text-blue-700 text-sm">
                See how the dashboard changes for different user roles
              </p>
            </div>
            <div className="flex space-x-2">
              {['participant', 'organizer', 'judge'].map((role) => (
                <Button
                  key={role}
                  size="sm"
                  variant={selectedRole === role ? 'primary' : 'outline'}
                  onClick={() => setSelectedRole(role as any)}
                  className="capitalize"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Dashboard */}
      {selectedRole === 'participant' && renderParticipantDashboard()}
      {selectedRole === 'organizer' && renderOrganizerDashboard()}
      {selectedRole === 'judge' && renderJudgeDashboard()}
    </div>
  );
};
