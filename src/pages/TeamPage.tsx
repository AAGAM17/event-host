import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  UserPlus, 
  Settings, 
  Edit,
  Trash2,
  Copy,
  Check,
  Star,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

interface TeamFormData {
  name: string;
  description: string;
  skills: string[];
  maxSize: number;
  isOpen: boolean;
  trackId?: string;
}

// Mock data
const currentTeam = {
  id: '1',
  name: 'Innovation Squad',
  description: 'Building the future of sustainable technology solutions',
  eventId: '1',
  eventName: 'SynapHack 3.0',
  trackId: '1',
  trackName: 'AI/ML',
  leader: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    skills: ['React', 'Python', 'Machine Learning']
  },
  members: [
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      skills: ['UI/UX', 'Figma', 'React']
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      skills: ['Backend', 'Node.js', 'MongoDB']
    }
  ],
  maxSize: 4,
  isOpen: true,
  skills: ['React', 'Python', 'Machine Learning', 'UI/UX', 'Backend'],
  inviteCode: 'TEAM-ABC123',
  createdAt: new Date('2024-08-15')
};

const availableTeams = [
  {
    id: '2',
    name: 'Code Wizards',
    description: 'Full-stack developers building amazing web applications',
    trackName: 'Web3',
    memberCount: 2,
    maxSize: 4,
    skills: ['JavaScript', 'Solidity', 'React', 'Web3'],
    isOpen: true,
    leader: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    name: 'Data Dynamos',
    description: 'Data scientists and analysts solving complex problems',
    trackName: 'AI/ML',
    memberCount: 3,
    maxSize: 5,
    skills: ['Python', 'TensorFlow', 'Data Science', 'Statistics'],
    isOpen: true,
    leader: {
      name: 'Dr. Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=40&h=40&fit=crop&crop=face'
    }
  },
  {
    id: '4',
    name: 'Green Tech Pioneers',
    description: 'Sustainability-focused team creating eco-friendly solutions',
    trackName: 'Sustainability',
    memberCount: 4,
    maxSize: 4,
    skills: ['IoT', 'Python', 'Environmental Science', 'Hardware'],
    isOpen: false,
    leader: {
      name: 'Green Martinez',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face'
    }
  }
];

const skillSuggestions = [
  'React', 'Python', 'JavaScript', 'Machine Learning', 'UI/UX', 'Backend',
  'Frontend', 'Data Science', 'Mobile Development', 'DevOps', 'Blockchain',
  'AI', 'Node.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
  'TensorFlow', 'PyTorch', 'Figma', 'Photoshop', 'Product Management'
];

export const TeamPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-team' | 'find-team' | 'create-team'>('my-team');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<TeamFormData>({
    defaultValues: {
      name: currentTeam?.name || '',
      description: currentTeam?.description || '',
      maxSize: currentTeam?.maxSize || 4,
      isOpen: currentTeam?.isOpen !== false
    }
  });

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(currentTeam.inviteCode);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const onSubmit = (data: TeamFormData) => {
    console.log('Team data:', data);
    setIsEditing(false);
    // Handle team update
  };

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const TabButton: React.FC<{ tab: typeof activeTab; children: React.ReactNode }> = ({ tab, children }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  const renderMyTeam = () => {
    if (!currentTeam) {
      return (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Team Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't joined a team for this hackathon. Create one or join an existing team.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setActiveTab('create-team')}>
                Create Team
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('find-team')}>
                Find Team
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Team Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <CardTitle className="text-2xl">{currentTeam.name}</CardTitle>
                  <Badge variant="primary">{currentTeam.trackName}</Badge>
                  <Badge variant={currentTeam.isOpen ? 'success' : 'secondary'}>
                    {currentTeam.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                <CardDescription className="text-base mb-4">
                  {currentTeam.description}
                </CardDescription>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {currentTeam.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentTeam.eventName}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Edit Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Team</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Team Name*"
                  {...register('name', { required: 'Team name is required' })}
                  error={errors.name?.message}
                />
                <Textarea
                  label="Description*"
                  {...register('description', { required: 'Description is required' })}
                  error={errors.description?.message}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Max Team Size*"
                    type="number"
                    min="2"
                    max="10"
                    {...register('maxSize', { 
                      required: 'Max size is required',
                      valueAsNumber: true,
                      min: { value: 2, message: 'Minimum team size is 2' },
                      max: { value: 10, message: 'Maximum team size is 10' }
                    })}
                    error={errors.maxSize?.message}
                  />
                  <div className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      id="isOpen"
                      {...register('isOpen')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="isOpen" className="text-sm font-medium">
                      Accept new members
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members ({currentTeam.members.length + 1}/{currentTeam.maxSize})
                </CardTitle>
                {currentTeam.isOpen && currentTeam.members.length + 1 < currentTeam.maxSize && (
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Team Leader */}
                <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <img
                    src={currentTeam.leader.avatar}
                    alt={currentTeam.leader.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{currentTeam.leader.name}</h4>
                      <Badge variant="primary" size="sm">Leader</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{currentTeam.leader.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {currentTeam.leader.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>

                {/* Team Members */}
                {currentTeam.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: currentTeam.maxSize - currentTeam.members.length - 1 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <UserPlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Empty slot</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Info */}
          <div className="space-y-6">
            {/* Invite Code */}
            <Card>
              <CardHeader>
                <CardTitle>Invite Code</CardTitle>
                <CardDescription>
                  Share this code with others to join your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    value={currentTeam.inviteCode}
                    readOnly
                    className="flex-1 font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyInviteCode}
                    className="flex items-center"
                  >
                    {copiedInvite ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copiedInvite && (
                  <p className="text-sm text-green-600 mt-2">
                    Invite code copied to clipboard!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Team Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentTeam.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Team Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Team Formation</span>
                    <span>
                      {Math.round(((currentTeam.members.length + 1) / currentTeam.maxSize) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ 
                        width: `${((currentTeam.members.length + 1) / currentTeam.maxSize) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-lg">{currentTeam.members.length + 1}</div>
                    <div className="text-gray-600">Members</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-lg">{currentTeam.skills.length}</div>
                    <div className="text-gray-600">Skills</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderFindTeam = () => (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams by name, skills, or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Available Teams */}
      <div className="grid gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">{team.name}</h3>
                    <Badge variant="outline">{team.trackName}</Badge>
                    <Badge variant={team.isOpen ? 'success' : 'secondary'}>
                      {team.isOpen ? 'Open' : 'Full'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{team.description}</p>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={team.leader.avatar}
                        alt={team.leader.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">
                        Led by {team.leader.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {team.memberCount}/{team.maxSize} members
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {team.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="ml-6">
                  <Button
                    variant={team.isOpen ? 'primary' : 'outline'}
                    disabled={!team.isOpen}
                  >
                    {team.isOpen ? 'Request to Join' : 'Team Full'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredTeams.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No teams found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or create a new team.
              </p>
              <Button onClick={() => setActiveTab('create-team')}>
                Create New Team
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderCreateTeam = () => (
    <Card>
      <CardHeader>
        <CardTitle>Create New Team</CardTitle>
        <CardDescription>
          Start a new team for the hackathon and invite other participants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Team Name*"
            placeholder="Enter your team name"
            {...register('name', { required: 'Team name is required' })}
            error={errors.name?.message}
          />
          
          <Textarea
            label="Description*"
            placeholder="Describe your team's goals and what you're looking to build..."
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Max Team Size*"
              type="number"
              min="2"
              max="10"
              defaultValue="4"
              {...register('maxSize', { 
                required: 'Max size is required',
                valueAsNumber: true,
                min: { value: 2, message: 'Minimum team size is 2' },
                max: { value: 10, message: 'Maximum team size is 10' }
              })}
              error={errors.maxSize?.message}
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Track (Optional)
              </label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                <option value="">Choose a track</option>
                <option value="ai-ml">AI/ML</option>
                <option value="web3">Web3</option>
                <option value="fintech">FinTech</option>
                <option value="healthcare">Healthcare</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Looking For
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {skillSuggestions.slice(0, 12).map((skill, index) => (
                <button
                  key={index}
                  type="button"
                  className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
            <Input
              placeholder="Add custom skills (comma separated)"
              helper="e.g., React, Python, Machine Learning"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOpen"
              defaultChecked
              {...register('isOpen')}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isOpen" className="text-sm font-medium">
              Allow others to request to join this team
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab('find-team')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Team
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Team Management
        </h1>
        <p className="text-xl text-gray-600">
          Join forces with other participants to build amazing projects together.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        <TabButton tab="my-team">My Team</TabButton>
        <TabButton tab="find-team">Find Team</TabButton>
        <TabButton tab="create-team">Create Team</TabButton>
      </div>

      {/* Content */}
      {activeTab === 'my-team' && renderMyTeam()}
      {activeTab === 'find-team' && renderFindTeam()}
      {activeTab === 'create-team' && renderCreateTeam()}
    </div>
  );
};
