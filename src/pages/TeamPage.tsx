import React, { useEffect, useMemo, useState } from 'react';
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
  MapPin,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000';

type TeamSummary = {
  _id: string;
  name: string;
  description?: string;
  maxSize: number;
  isOpen: boolean;
  skills: string[];
  track?: string | null;
  memberCount: number;
  leader: string; // id in summary
  inviteCode?: string;
};

type UserRef = { name: string; email: string };

type TeamDetail = {
  _id: string;
  name: string;
  description?: string;
  maxSize: number;
  isOpen: boolean;
  skills: string[];
  track?: string | null;
  leader: UserRef;
  members: UserRef[];
  inviteCode?: string;
  createdAt: string;
};

interface TeamFormData {
  name: string;
  description: string;
  skills: string[];
  maxSize: number;
  isOpen: boolean;
  track?: string;
}

export const TeamPage: React.FC = () => {
  const { isAuthenticated, isOrganizer } = useAuth();

  const [events, setEvents] = useState<{ _id: string; title: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [registered, setRegistered] = useState<boolean>(false);

  const [myTeam, setMyTeam] = useState<TeamDetail | null>(null);
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showOrganizerTeams, setShowOrganizerTeams] = useState(false);
  const [organizerTeams, setOrganizerTeams] = useState<TeamDetail[]>([]);

  const token = useMemo(() => localStorage.getItem('auth_token') || '', []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TeamFormData>({
    defaultValues: { name: '', description: '', maxSize: 4, isOpen: true, skills: [], track: '' }
  });

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API_BASE}/api/events`);
        const data = await res.json();
        const list = Array.isArray(data) ? data.map((e: any) => ({ _id: e._id, title: e.title })) : [];
        setEvents(list);
        if (list.length > 0) setSelectedEventId(list[0]._id);
      } catch (e: any) {
        setError('Failed to load events');
      }
    }
    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    setError(null);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    async function loadRegistration() {
      try {
        const res = await fetch(`${API_BASE}/api/events/${selectedEventId}/registration`, { headers });
        if (!res.ok) { setRegistered(false); return; }
        const data = await res.json();
        setRegistered(!!data.registered);
      } catch {
        setRegistered(false);
      }
    }

    async function loadTeams() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/events/${selectedEventId}/teams`, { headers });
        const data = await res.json();
        setTeams(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError('Failed to load teams');
      } finally {
        setLoading(false);
      }
    }

    async function loadMyTeam() {
      try {
        const res = await fetch(`${API_BASE}/api/me/teams?eventId=${selectedEventId}`, { headers });
        if (!res.ok) { setMyTeam(null); return; }
        const data = await res.json();
        setMyTeam(data);
      } catch {
        setMyTeam(null);
      }
    }

    loadRegistration();
    loadTeams();
    if (isAuthenticated) loadMyTeam();
  }, [selectedEventId, token, isAuthenticated]);

  const registerForEvent = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/events/${selectedEventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (!res.ok) throw new Error('Failed to register');
      setRegistered(true);
    } catch (e: any) {
      setError(e.message || 'Failed to register');
    }
  };

  const createTeam = async (data: TeamFormData) => {
    try {
      if (!registered) { setError('Register for the event first'); return; }
      const res = await fetch(`${API_BASE}/api/events/${selectedEventId}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          maxSize: data.maxSize,
          isOpen: data.isOpen,
          skills: data.skills,
          track: data.track
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create team');
      }
      reset();
      // Refresh my team and team list
      const [myTeamRes, teamsRes] = await Promise.all([
        fetch(`${API_BASE}/api/me/teams?eventId=${selectedEventId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
        fetch(`${API_BASE}/api/events/${selectedEventId}/teams`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      ]);
      setMyTeam(myTeamRes.ok ? await myTeamRes.json() : null);
      setTeams(teamsRes.ok ? await teamsRes.json() : []);
      // setActiveTab('my-team'); // No longer needed, refresh handles it
    } catch (e: any) {
      setError(e.message || 'Failed to create team');
    }
  };

  const joinTeam = async (teamId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to join');
      }
      setMyTeam(await res.json());
      // setActiveTab('my-team'); // No longer needed, refresh handles it
    } catch (e: any) {
      setError(e.message || 'Failed to join');
    }
  };

  const joinByInvite = async (inviteCode: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/join-by-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ inviteCode })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Invalid code');
      }
      setMyTeam(await res.json());
      // setActiveTab('my-team'); // No longer needed, refresh handles it
    } catch (e: any) {
      setError(e.message || 'Failed to join by code');
    }
  };

  const leaveTeam = async (teamId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamId}/leave`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (!res.ok) throw new Error('Failed to leave');
      const data = await res.json();
      if (data?.deleted || !data?._id) {
        setMyTeam(null);
      } else {
        setMyTeam(data);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to leave team');
    }
  };

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.skills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const [activeTab, setActiveTab] = useState<'my-team' | 'find-team' | 'create-team'>('my-team');

  const [inviteInput, setInviteInput] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Team Management</h1>
        <p className="text-xl text-gray-600">Join forces with other participants to build amazing projects together.</p>
      </div>

      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}

      {/* Event selection and registration */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Event:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.title}</option>
            ))}
          </select>
        </div>
        <div>
          {!registered ? (
            <Button size="sm" onClick={registerForEvent} disabled={!isAuthenticated}>Register for Event</Button>
          ) : (
            <span className="text-sm text-green-700">Registered</span>
          )}
        </div>
        {isOrganizer && (
          <div className="ml-auto flex items-center gap-2">
            <input id="orgToggle" type="checkbox" checked={showOrganizerTeams} onChange={() => setShowOrganizerTeams(!showOrganizerTeams)} />
            <label htmlFor="orgToggle" className="text-sm">Organizer view</label>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                try {
                  const res = await fetch(`${API_BASE}/api/events/${selectedEventId}/teams/detail`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                  setOrganizerTeams(res.ok ? await res.json() : []);
                } catch { setOrganizerTeams([]); }
              }}
            >
              Refresh Teams
            </Button>
          </div>
        )}
      </div>

      {showOrganizerTeams && isOrganizer && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>All Teams (Organizer)</CardTitle>
            <CardDescription>Teams for the selected event</CardDescription>
          </CardHeader>
          <CardContent>
            {organizerTeams.length === 0 ? (
              <div className="text-sm text-gray-500">No teams yet.</div>
            ) : (
              <div className="space-y-3">
                {organizerTeams.map(t => (
                  <div key={t._id} className="border rounded p-3">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-gray-600">Members: {1 + (t.members?.length || 0)}</div>
                    <div className="text-sm">Leader: {t.leader?.name} ({t.leader?.email})</div>
                    <div className="text-sm">Invite: {t.inviteCode || '-'}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('my-team')} className={`px-4 py-2 font-medium rounded-lg ${activeTab === 'my-team' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>My Team</button>
        <button onClick={() => setActiveTab('find-team')} className={`px-4 py-2 font-medium rounded-lg ${activeTab === 'find-team' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Find Team</button>
        <button onClick={() => setActiveTab('create-team')} className={`px-4 py-2 font-medium rounded-lg ${activeTab === 'create-team' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Create Team</button>
      </div>

      {activeTab === 'my-team' && (
        <div>
          {!myTeam ? (
            <Card>
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Team Yet</h3>
                <p className="text-gray-600 mb-6">You haven't joined a team for this event. Create one or join an existing team.</p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setActiveTab('create-team')}>Create Team</Button>
                  <Button variant="outline" onClick={() => setActiveTab('find-team')}>Find Team</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-2xl">{myTeam.name}</CardTitle>
                        <Badge variant="primary">{myTeam.track || 'General'}</Badge>
                        <Badge variant={myTeam.isOpen ? 'success' : 'secondary'}>{myTeam.isOpen ? 'Open' : 'Closed'}</Badge>
                      </div>
                      <CardDescription className="text-base mb-4">{myTeam.description}</CardDescription>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Created {new Date(myTeam.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Team size {1 + (myTeam.members?.length || 0)}/{myTeam.maxSize}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => leaveTeam(myTeam._id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Leave
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {isEditing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 mb-2">Editing not wired to backend yet.</div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Team Members ({1 + (myTeam.members?.length || 0)}/{myTeam.maxSize})
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">{myTeam.leader?.name?.[0] || 'L'}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{myTeam.leader?.name}</h4>
                            <Badge variant="primary" size="sm">Leader</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{myTeam.leader?.email}</p>
                        </div>
                        <Star className="h-5 w-5 text-yellow-500" />
                      </div>

                      {myTeam.members?.map((m, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">{m.name?.[0] || 'M'}</div>
                          <div className="flex-1">
                            <h4 className="font-medium">{m.name}</h4>
                            <p className="text-sm text-gray-600">{m.email}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      {Array.from({ length: Math.max(0, myTeam.maxSize - (1 + (myTeam.members?.length || 0))) }).map((_, index) => (
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

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Invite Code</CardTitle>
                      <CardDescription>Share this with others to join your team</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Input value={myTeam.inviteCode || ''} readOnly className="flex-1 font-mono" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!myTeam.inviteCode) return;
                            navigator.clipboard.writeText(myTeam.inviteCode);
                            setCopiedInvite(true);
                            setTimeout(() => setCopiedInvite(false), 2000);
                          }}
                          className="flex items-center"
                        >
                          {copiedInvite ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      {copiedInvite && (
                        <p className="text-sm text-green-600 mt-2">Invite code copied!</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Team Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(myTeam.skills || []).map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'find-team' && (
        <div className="space-y-6">
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

          <div className="flex items-center gap-2">
            <Input placeholder="Have an invite code? Enter here" value={inviteInput} onChange={(e) => setInviteInput(e.target.value)} />
            <Button onClick={() => inviteInput.trim() && joinByInvite(inviteInput.trim())}>Join</Button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="text-sm text-gray-600">Loading teams...</div>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map(team => (
                <Card key={team._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">{team.name}</h3>
                          <Badge variant="outline">{team.track || 'General'}</Badge>
                          <Badge variant={team.isOpen ? 'success' : 'secondary'}>{team.isOpen ? 'Open' : 'Full'}</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{team.description}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          {team.memberCount}/{team.maxSize} members
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(team.skills || []).map((s, idx) => (
                            <Badge key={idx} variant="secondary" size="sm">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="ml-6">
                        <Button
                          variant={team.isOpen ? 'primary' : 'outline'}
                          disabled={!team.isOpen || !registered}
                          onClick={() => joinTeam(team._id)}
                        >
                          {team.isOpen ? (registered ? 'Join' : 'Register first') : 'Team Full'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No teams found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or create a new team.</p>
                  <Button onClick={() => setActiveTab('create-team')}>Create New Team</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create-team' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Team</CardTitle>
            <CardDescription>Start a new team for the hackathon and invite other participants</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(createTeam)} className="space-y-6">
              <Input label="Team Name*" placeholder="Enter your team name" {...register('name', { required: 'Team name is required' })} error={errors.name?.message} />
              <Textarea label="Description*" placeholder="Describe your team goals..." {...register('description', { required: 'Description is required' })} error={errors.description?.message} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Max Team Size*" type="number" min="2" max="10" defaultValue="4" {...register('maxSize', { required: 'Max size is required', valueAsNumber: true, min: { value: 2, message: 'Minimum team size is 2' }, max: { value: 10, message: 'Maximum team size is 10' } })} error={errors.maxSize?.message} />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Track (Optional)</label>
                  <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" {...register('track')}>
                    <option value="">Choose a track</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Web3">Web3</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isOpen" defaultChecked {...register('isOpen')} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="isOpen" className="text-sm font-medium">Allow others to request to join this team</label>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab('find-team')}>Cancel</Button>
                <Button type="submit" disabled={!registered}>Create Team</Button>
              </div>
              {!registered && <div className="text-xs text-gray-500">Register for the selected event to create a team.</div>}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
