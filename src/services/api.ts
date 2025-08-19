// src/services/api.ts
import type { ProjectSubmission, PlagiarismAnalysis } from './plagiarismService';
import type {
  Event,
  Team,
  Project,
  User,
  Registration,
  Analytics,
  ApiResponse,
  PaginatedResponse,
  AuthUser,
  RegisterData,
} from '../types';

// Use Vite's import.meta.env instead of process.env for client-side
const API_BASE_URL = (import.meta.env?.VITE_API_URL) || 'http://localhost:3001';

// Generic API error class
export class ApiError extends Error {
  public status: number;
  public response?: Response;
  
  constructor(
    message: string,
    status: number,
    response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch {
        // Ignore error text parsing failures
      }
      
      throw new ApiError(errorMessage, response.status, response);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

// Plagiarism API
export const plagiarismAPI = {
  /**
   * Analyze a project for plagiarism
   */
  analyzeProject: async (projectData: ProjectSubmission): Promise<PlagiarismAnalysis> => {
    return apiRequest<PlagiarismAnalysis>('/api/plagiarism/analyze', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Get plagiarism statistics
   */
  getStatistics: async (): Promise<{
    totalSubmissions: number;
    flaggedSubmissions: number;
    averageSimilarity: number;
    accuracyRate: number;
  }> => {
    return apiRequest('/api/plagiarism/statistics');
  },

  /**
   * Get all submissions with plagiarism analysis
   */
  getSubmissions: async (
    page = 1, 
    limit = 10
  ): Promise<PaginatedResponse<ProjectSubmission & { analysis?: PlagiarismAnalysis }>> => {
    return apiRequest(`/api/plagiarism/submissions?page=${page}&limit=${limit}`);
  },

  /**
   * Get detailed analysis for a specific submission
   */
  getAnalysis: async (submissionId: string): Promise<PlagiarismAnalysis> => {
    return apiRequest(`/api/plagiarism/analysis/${submissionId}`);
  },

  /**
   * Update plagiarism analysis status (admin only)
   */
  updateAnalysisStatus: async (
    submissionId: string, 
    status: 'approved' | 'flagged' | 'under_review'
  ): Promise<ApiResponse<void>> => {
    return apiRequest(`/api/plagiarism/analysis/${submissionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Events API
export const eventsAPI = {
  /**
   * Get all events
   */
  getEvents: async (page = 1, limit = 10): Promise<PaginatedResponse<Event>> => {
    return apiRequest(`/api/events?page=${page}&limit=${limit}`);
  },

  /**
   * Get event by ID
   */
  getEvent: async (id: string): Promise<Event> => {
    return apiRequest(`/api/events/${id}`);
  },

  /**
   * Create new event
   */
  createEvent: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
    return apiRequest('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  /**
   * Update event
   */
  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    return apiRequest(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  /**
   * Delete event
   */
  deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get event analytics
   */
  getEventAnalytics: async (id: string): Promise<Analytics> => {
    return apiRequest(`/api/events/${id}/analytics`);
  },
};

// Teams API
export const teamsAPI = {
  /**
   * Get teams for an event
   */
  getTeams: async (eventId: string): Promise<Team[]> => {
    return apiRequest(`/api/events/${eventId}/teams`);
  },

  /**
   * Create team
   */
  createTeam: async (eventId: string, teamData: Omit<Team, 'id'>): Promise<Team> => {
    return apiRequest(`/api/events/${eventId}/teams`, {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  },

  /**
   * Join team
   */
  joinTeam: async (teamId: string, inviteCode?: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/api/teams/${teamId}/join`, {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  },

  /**
   * Leave team
   */
  leaveTeam: async (teamId: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/api/teams/${teamId}/leave`, {
      method: 'POST',
    });
  },
};

// Projects API
export const projectsAPI = {
  /**
   * Get projects for an event
   */
  getProjects: async (eventId: string): Promise<Project[]> => {
    return apiRequest(`/api/events/${eventId}/projects`);
  },

  /**
   * Submit project
   */
  submitProject: async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    return apiRequest('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Update project
   */
  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    return apiRequest(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },
};

// Users API
export const usersAPI = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return apiRequest('/api/users/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Register for event
   */
  registerForEvent: async (eventId: string, registrationData: Omit<Registration, 'id' | 'userId' | 'registeredAt'>): Promise<Registration> => {
    return apiRequest(`/api/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },
};

// Authentication API
export const authAPI = {
  /**
   * Login user
   */
  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Register user
   */
  register: async (userData: RegisterData): Promise<{ user: AuthUser; token: string }> => {
    return apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Refresh token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    return apiRequest('/api/auth/refresh', {
      method: 'POST',
    });
  },
};

// File upload API
export const filesAPI = {
  /**
   * Upload file
   */
  uploadFile: async (file: File, folder = 'uploads'): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return apiRequest('/api/files/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },

  /**
   * Upload multiple files
   */
  uploadFiles: async (files: File[], folder = 'uploads'): Promise<{ url: string; filename: string }[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);

    return apiRequest('/api/files/upload-multiple', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },
};

// Export all APIs as a single object for convenience
export const api = {
  plagiarism: plagiarismAPI,
  events: eventsAPI,
  teams: teamsAPI,
  projects: projectsAPI,
  users: usersAPI,
  auth: authAPI,
  files: filesAPI,
};

export default api;