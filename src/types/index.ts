export type UserRole = "participant" | "organizer" | "judge";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export const mockCurrentUser: User = {
  id: "1",
  name: "Alice",
  role: "participant", // change to "organizer" or "judge" to test
};

export interface Event {
  id: string;
  title: string;
  description: string;
  theme: string;
  type: 'online' | 'offline' | 'hybrid';
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed';
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxParticipants?: number;
  currentParticipants: number;
  tracks: Track[];
  rules: string[];
  prizes: Prize[];
  sponsors: Sponsor[];
  organizers: User[];
  judges: User[];
  location?: string;
  venue?: string;
  imageUrl?: string;
  websiteUrl?: string;
  requirements: string[];
}

export interface Track {
  id: string;
  name: string;
  description: string;
  color: string;
  maxTeams?: number;
  currentTeams: number;
}

export interface Prize {
  id: string;
  title: string;
  description: string;
  value: string;
  trackId?: string; // If prize is track-specific
  position: number; // 1st, 2nd, 3rd, etc.
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  eventId: string;
  trackId?: string;
  leader: User;
  members: User[];
  maxSize: number;
  isOpen: boolean;
  skills: string[];
  description?: string;
  inviteCode?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  teamId: string;
  eventId: string;
  trackId?: string;
  submissionDate: Date;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  presentationUrl?: string;
  technologies: string[];
  status: 'draft' | 'submitted' | 'under_review' | 'reviewed';
}

export interface Submission {
  id: string;
  projectId: string;
  round: number;
  submittedAt: Date;
  documents: Document[];
  links: SubmissionLink[];
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'ppt' | 'other';
  size: number;
}

export interface SubmissionLink {
  id: string;
  title: string;
  url: string;
  type: 'github' | 'demo' | 'video' | 'presentation' | 'other';
}

export interface Evaluation {
  id: string;
  projectId: string;
  judgeId: string;
  round: number;
  scores: Score[];
  feedback: string;
  submittedAt: Date;
  status: 'pending' | 'completed';
}

export interface Score {
  criteriaId: string;
  criteriaName: string;
  score: number;
  maxScore: number;
  weight: number;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface Announcement {
  id: string;
  eventId: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'update' | 'reminder';
  authorId: string;
  author: User;
  publishedAt: Date;
  isPublished: boolean;
  targetAudience: 'all' | 'participants' | 'judges' | 'organizers';
}

export interface Question {
  id: string;
  eventId: string;
  question: string;
  answer?: string;
  askedBy: User;
  answeredBy?: User;
  askedAt: Date;
  answeredAt?: Date;
  isPublic: boolean;
  category: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: Date;
  status: 'registered' | 'confirmed' | 'checked_in' | 'cancelled';
  teamId?: string;
  preferences: RegistrationPreferences;
}

export interface RegistrationPreferences {
  hasTeam: boolean;
  lookingForTeam: boolean;
  preferredTrack?: string;
  skills: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  previousHackathons: number;
}

export interface Certificate {
  id: string;
  userId: string;
  eventId: string;
  type: 'participation' | 'winner' | 'runner_up' | 'special';
  issuedAt: Date;
  templateUrl: string;
  certificateUrl: string;
}

export interface Analytics {
  eventId: string;
  totalRegistrations: number;
  totalSubmissions: number;
  totalTeams: number;
  registrationsByDay: { date: string; count: number }[];
  submissionsByTrack: { trackId: string; trackName: string; count: number }[];
  participantDemographics: {
    universities: { name: string; count: number }[];
    experienceLevels: { level: string; count: number }[];
    skills: { skill: string; count: number }[];
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  totalSubmissions: number;
  upcomingEvents: number;
}

// Authentication types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'organizer' | 'judge';
  avatar?: string;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'participant' | 'organizer';
  university?: string;
  skills?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface EventFormData {
  title: string;
  description: string;
  theme: string;
  type: 'online' | 'offline' | 'hybrid';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants?: number;
  location?: string;
  venue?: string;
  requirements: string[];
  tracks: Omit<Track, 'id' | 'currentTeams'>[];
  prizes: Omit<Prize, 'id'>[];
  evaluationCriteria: Omit<EvaluationCriteria, 'id'>[];
}

export interface TeamFormData {
  name: string;
  description: string;
  skills: string[];
  maxSize: number;
  isOpen: boolean;
  trackId?: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  presentationUrl?: string;
  technologies: string[];
  trackId?: string;
}
