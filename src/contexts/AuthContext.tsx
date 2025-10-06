import React, { createContext, useContext, useState, useEffect } from 'react';
import { createSession, validateSession, updateSessionActivity, sendSecurityNotification, getCurrentDevice } from '../lib/security';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
  progress: {
    level: number;
    wordsLearned: number;
    streak: number;
  };
  securitySettings?: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    sessionTimeout: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  sessionId: string | null;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  socialLogin: (socialUser: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthState();
    setupSessionTimeout();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = localStorage.getItem('user');
      const currentSession = localStorage.getItem('currentSession');
      
      if (userData && currentSession && validateSession(currentSession)) {
        setUser(JSON.parse(userData));
        setSessionId(currentSession);
        updateSessionActivity(currentSession);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('currentSession');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSessionTimeout = () => {
    setInterval(() => {
      const currentSession = localStorage.getItem('currentSession');
      if (currentSession && !validateSession(currentSession)) {
        logout();
      }
    }, 60000); // Check every minute
  };

  const login = async (email: string, password: string, twoFactorCode?: string) => {
    try {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        progress: { level: 5, wordsLearned: 150, streak: 7 },
        securitySettings: { twoFactorEnabled: false, emailNotifications: true, sessionTimeout: 24 }
      };
      
      const newSessionId = createSession(mockUser.id);
      const device = getCurrentDevice();
      
      // Send login notification
      await sendSecurityNotification(email, 'login', { device: device.name, location: device.location });
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSessionId(newSessionId);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const mockUser: User = {
        id: '1',
        name,
        email,
        progress: { level: 1, wordsLearned: 0, streak: 0 },
        securitySettings: { twoFactorEnabled: false, emailNotifications: true, sessionTimeout: 24 }
      };
      
      const newSessionId = createSession(mockUser.id);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSessionId(newSessionId);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const socialLogin = async (socialUser: any) => {
    try {
      const user: User = {
        id: socialUser.id,
        name: socialUser.name,
        email: socialUser.email,
        avatar: socialUser.avatar,
        provider: socialUser.provider,
        progress: { level: 1, wordsLearned: 0, streak: 0 },
        securitySettings: { twoFactorEnabled: false, emailNotifications: true, sessionTimeout: 24 }
      };
      
      const newSessionId = createSession(user.id);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setSessionId(newSessionId);
    } catch (error) {
      throw new Error('Social login failed');
    }
  };

  const logout = async () => {
    try {
      if (sessionId) {
        localStorage.removeItem(`session_${sessionId}`);
      }
      localStorage.removeItem('user');
      localStorage.removeItem('currentSession');
      setUser(null);
      setSessionId(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendSecurityNotification(email, 'password_reset', { timestamp: new Date() });
      console.log('Password reset email sent to:', email);
    } catch (error) {
      throw new Error('Password reset failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        sessionId,
        login,
        register,
        socialLogin,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};