import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database types (you can generate these from Supabase later)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          language: string;
          lessons_completed: number;
          total_xp: number;
          streak_days: number;
          last_activity: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          language: string;
          lessons_completed?: number;
          total_xp?: number;
          streak_days?: number;
          last_activity?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          language?: string;
          lessons_completed?: number;
          total_xp?: number;
          streak_days?: number;
          last_activity?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          language: string;
          title: string;
          description: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          content: any;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          language: string;
          title: string;
          description: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          content: any;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          language?: string;
          title?: string;
          description?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          content?: any;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper functions for common operations
export const supabaseHelpers = {
  // User operations
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // User progress operations
  async getUserProgress(userId: string, language: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('language', language)
      .single();
    return { data, error };
  },

  async updateUserProgress(userId: string, language: string, updates: any) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        language,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },

  // Lesson operations
  async getLessons(language: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('language', language)
      .order('order_index', { ascending: true });
    return { data, error };
  },

  async getLesson(id: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },
};

export default supabase;
