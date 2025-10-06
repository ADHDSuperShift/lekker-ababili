// API service layer for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  nativeLanguage: string;
  targetLanguage: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    nativeLanguage: string;
    targetLanguage: string;
    createdAt: string;
  };
  token: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  content: {
    vocabulary: Array<{
      word: string;
      translation: string;
      pronunciation?: string;
      example?: string;
    }>;
    exercises: Array<{
      type: 'multiple-choice' | 'translation' | 'speaking';
      question: string;
      options?: string[];
      correctAnswer: string;
    }>;
  };
  estimatedTime: number;
  prerequisites?: string[];
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format');
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.setToken(null);
    return result;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
  }

  // User profile endpoints
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/user/profile');
  }

  async updateProfile(updates: any): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Lesson endpoints
  async getLessons(params?: {
    category?: string;
    difficulty?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ lessons: Lesson[]; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/lessons${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ lessons: Lesson[]; total: number }>(endpoint);
  }

  async getLesson(id: string): Promise<ApiResponse<Lesson>> {
    return this.request<Lesson>(`/lessons/${id}`);
  }

  // Progress endpoints
  async getProgress(): Promise<ApiResponse<any>> {
    return this.request('/user/progress');
  }

  async updateProgress(progressData: any): Promise<ApiResponse<any>> {
    return this.request('/user/progress', {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  async completeLesson(lessonId: string, score: number): Promise<ApiResponse<any>> {
    return this.request('/user/progress/lesson', {
      method: 'POST',
      body: JSON.stringify({ lessonId, score, completedAt: new Date().toISOString() }),
    });
  }

  // Sync endpoints for offline functionality
  async syncOfflineData(data: any): Promise<ApiResponse<any>> {
    return this.request('/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();