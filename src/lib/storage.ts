// Local storage utility for persisting user data
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  nativeLanguage: string;
  targetLanguage: string;
  notifications: {
    dailyReminders: boolean;
    weeklyProgress: boolean;
    achievements: boolean;
    marketing: boolean;
  };
  progress: {
    totalWords: number;
    wordsLearned: number;
    streakDays: number;
    level: number;
    achievements: string[];
    skillLevels: {
      speaking: number;
      listening: number;
      reading: number;
      writing: number;
    };
  };
  createdAt: string;
  lastActive: string;
}

const STORAGE_KEYS = {
  USER_PROFILE: 'lekker_ababili_user_profile',
  ONBOARDING_COMPLETE: 'lekker_ababili_onboarding_complete',
  LANGUAGE_PREFERENCES: 'lekker_ababili_language_prefs',
  LEARNING_PROGRESS: 'lekker_ababili_progress',
} as const;

export const storage = {
  // User profile operations
  saveUserProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  },

  getUserProfile: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  },

  // Onboarding state
  setOnboardingComplete: (complete: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete.toString());
  },

  isOnboardingComplete: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
  },

  // Language preferences
  saveLanguagePreferences: (native: string, target: string): void => {
    const prefs = { native, target };
    localStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCES, JSON.stringify(prefs));
  },

  getLanguagePreferences: (): { native: string; target: string } | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load language preferences:', error);
      return null;
    }
  },

  // Learning progress
  saveLearningProgress: (progress: UserProfile['progress']): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save learning progress:', error);
    }
  },

  getLearningProgress: (): UserProfile['progress'] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNING_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load learning progress:', error);
      return null;
    }
  },

  // Clear all data
  clearAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};