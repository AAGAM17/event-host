import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Target, 
  Star,
  Crown,
  Zap,
  Filter,
  Search,
  BarChart3
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock data
const leaderboardData = {
  overall: [
    {
      rank: 1,
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      university: 'Stanford University',
      totalScore: 2850,
      eventsWon: 8,
      projectsSubmitted: 12,
      averageScore: 92.5,
      badges: ['Innovation Master', 'Tech Wizard', 'Team Player']
    },
    {
      rank: 2,
      id: '2',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      university: 'MIT',
      totalScore: 2720,
      eventsWon: 6,
      projectsSubmitted: 15,
      averageScore: 89.3,
      badges: ['Code Ninja', 'Design Guru']
    },
    {
      rank: 3,
      id: '3',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      university: 'UC Berkeley',
      totalScore: 2680,
      eventsWon: 7,
      projectsSubmitted: 11,
      averageScore: 91.2,
      badges: ['AI Expert', 'Problem Solver']
    },
    {
      rank: 4,
      id: '4',
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      university: 'Harvard University',
      totalScore: 2590,
      eventsWon: 5,
      projectsSubmitted: 13,
      averageScore: 88.7,
      badges: ['Full Stack Pro', 'Team Lead']
    },
    {
      rank: 5,
      id: '5',
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop&crop=face',
      university: 'Carnegie Mellon',
      totalScore: 2480,
      eventsWon: 4,
      projectsSubmitted: 10,
      averageScore: 90.1,
      badges: ['Data Scientist', 'Innovation Star']
    }
  ],
  eventSpecific: {
    'SynapHack 3.0': [
      {
        rank: 1,
        teamName: 'Innovation Squad',
        members: ['John Doe', 'Sarah Chen', 'Mike Johnson'],
        projectTitle: 'EcoTrack - Sustainable Habit Tracker',
        score: 94.5,
        track: 'AI/ML'
      },
      {
        rank: 2,
        teamName: 'Code Wizards',
        members: ['Alex Rivera', 'Lisa Wang', 'David Kim'],
        projectTitle: 'SmartFinance - AI Budget Assistant',
        score: 92.8,
        track: 'FinTech'
      },
      {
        rank: 3,
        teamName: 'Data Dynamos',
        members: ['Emma Wilson', 'Robert Lee', 'Sophia Martinez'],
        projectTitle: 'HealthPredict - Disease Prevention AI',
        score: 91.2,
        track: 'Healthcare'
      }
    ]
  },
  stats: {
    totalParticipants: 2847,
    totalProjects: 1234,
    averageScore: 82.4,
    topUniversities: [
      { name: 'Stanford University', participants: 342, avgScore: 87.2 },
      { name: 'MIT', participants: 298, avgScore: 86.8 },
      { name: 'UC Berkeley', participants: 276, avgScore: 85.9 },
      { name: 'Harvard University', participants: 234, avgScore: 85.1 },
      { name: 'Carnegie Mellon', participants: 198, avgScore: 84.7 }
    ]
  }
};

const events = [
  { id: 'overall', name: 'Overall Rankings' },
  { id: 'synaphack-3', name: 'SynapHack 3.0' },
  { id: 'ecohack-2024', name: 'EcoHack 2024' },
  { id: 'healthtech', name: 'HealthTech Innovation' }
];

const timeframes = [
  { id: 'all-time', name: 'All Time' },
  { id: 'this-year', name: 'This Year' },
  { id: 'this-month', name: 'This Month' }
];

export const LeaderboardPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState('overall');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all-time');
  const [searchTerm, setSearchTerm] = useState('');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const renderOverallLeaderboard = () => (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-end space-x-4 mb-8">
            {leaderboardData.overall.slice(0, 3).map((user, index) => {
              const heights = ['h-32', 'h-40', 'h-28'];
              const positions = [1, 0, 2]; // Reorder for podium effect
              const actualUser = leaderboardData.overall[positions[index]];
              
              return (
                <div key={actualUser.id} className="text-center">
                  <div className={`${heights[index]} w-24 bg-gradient-to-t ${
                    actualUser.rank === 1 ? 'from-yellow-400 to-yellow-500' :
                    actualUser.rank === 2 ? 'from-gray-400 to-gray-500' :
                    'from-orange-400 to-orange-500'
                  } rounded-t-lg flex flex-col justify-end pb-4`}>
                    <div className="text-white font-bold text-lg">#{actualUser.rank}</div>
                  </div>
                  <div className="mt-3">
                    <img
                      src={actualUser.avatar}
                      alt={actualUser.name}
                      className="w-12 h-12 rounded-full mx-auto mb-2 border-4 border-white shadow-lg"
                    />
                    <h3 className="font-semibold text-sm">{actualUser.name}</h3>
                    <p className="text-xs text-gray-600">{actualUser.totalScore} points</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.overall.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-4 rounded-lg border ${getRankBackground(user.rank)}`}
              >
                <div className="flex items-center justify-center w-12 h-12 mr-4">
                  {getRankIcon(user.rank)}
                </div>
                
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    {user.rank <= 3 && (
                      <Badge variant="primary" size="sm">
                        Top {user.rank}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{user.university}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.badges.slice(0, 2).map((badge, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {badge}
                      </Badge>
                    ))}
                    {user.badges.length > 2 && (
                      <Badge variant="secondary" size="sm">
                        +{user.badges.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {user.totalScore}
                  </div>
                  <p className="text-sm text-gray-600">points</p>
                  <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                    <span>{user.eventsWon} wins</span>
                    <span>{user.projectsSubmitted} projects</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEventLeaderboard = () => {
    const eventData = leaderboardData.eventSpecific['SynapHack 3.0'];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Rankings - {selectedEvent}</CardTitle>
          <CardDescription>
            Top performing teams in the current hackathon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventData.map((team) => (
              <div
                key={team.rank}
                className={`flex items-center p-4 rounded-lg border ${getRankBackground(team.rank)}`}
              >
                <div className="flex items-center justify-center w-12 h-12 mr-4">
                  {getRankIcon(team.rank)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-lg">{team.teamName}</h3>
                    <Badge variant="outline">{team.track}</Badge>
                  </div>
                  <h4 className="font-medium text-primary-600 mb-2">{team.projectTitle}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{team.members.join(', ')}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {team.score}
                  </div>
                  <p className="text-sm text-gray-600">score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Leaderboard
        </h1>
        <p className="text-xl text-gray-600">
          See how participants and teams rank across all hackathons and events.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search participants or teams..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Event Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Event:</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {timeframes.map((timeframe) => (
                  <option key={timeframe.id} value={timeframe.id}>
                    {timeframe.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-3">
          {selectedEvent === 'overall' ? renderOverallLeaderboard() : renderEventLeaderboard()}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Platform Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Total Participants</span>
                </div>
                <span className="font-semibold">{leaderboardData.stats.totalParticipants.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Total Projects</span>
                </div>
                <span className="font-semibold">{leaderboardData.stats.totalProjects.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Average Score</span>
                </div>
                <span className="font-semibold">{leaderboardData.stats.averageScore}</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Universities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Top Universities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.stats.topUniversities.map((university, index) => (
                  <div key={university.name} className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium text-sm">{university.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {university.participants} participants
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{university.avgScore}</div>
                      <div className="text-xs text-gray-500">avg score</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', badge: 'Innovation Master', time: '2 hours ago' },
                  { name: 'Alex Rivera', badge: 'Code Ninja', time: '5 hours ago' },
                  { name: 'Emma Wilson', badge: 'AI Expert', time: '1 day ago' }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{achievement.name}</p>
                      <p className="text-xs text-gray-500">earned {achievement.badge}</p>
                    </div>
                    <span className="text-xs text-gray-400">{achievement.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
