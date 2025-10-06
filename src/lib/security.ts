// Security utilities for authentication and device management

export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

export interface LoginHistory {
  id: string;
  timestamp: Date;
  device: string;
  location: string;
  ipAddress: string;
  success: boolean;
  suspicious: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  sessionTimeout: number;
  suspiciousActivityDetection: boolean;
}

// Mock 2FA utilities
export const generate2FASecret = (): string => {
  return 'JBSWY3DPEHPK3PXP'; // Mock secret
};

export const generateQRCode = (secret: string, email: string): string => {
  const issuer = 'Lekker Ababili';
  const otpauth = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
};

export const verify2FACode = (code: string, secret: string): boolean => {
  // Mock verification - in real app, use TOTP library
  return code === '123456';
};

export const generateBackupCodes = (): string[] => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
  }
  return codes;
};

// Device detection
const getBrowser = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  return 'Unknown';
};

const getOS = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
};

export const getCurrentDevice = (): Device => {
  const userAgent = navigator.userAgent;
  const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop';
  
  return {
    id: 'current-device',
    name: `${deviceType} Device`,
    type: deviceType as 'desktop' | 'mobile',
    browser: getBrowser(),
    os: getOS(),
    location: 'New York, NY',
    lastActive: new Date(),
    isCurrent: true
  };
};



// Suspicious activity detection
export const detectSuspiciousActivity = (loginHistory: LoginHistory[]): boolean => {
  if (loginHistory.length < 2) return false;
  
  const recent = loginHistory.slice(0, 5);
  const locations = new Set(recent.map(h => h.location));
  const timeSpan = recent[0].timestamp.getTime() - recent[recent.length - 1].timestamp.getTime();
  
  return locations.size > 3 && timeSpan < 3600000; // Multiple locations in 1 hour
};

// Email notifications
export const sendSecurityNotification = async (
  email: string, 
  type: 'login' | 'password_reset' | 'suspicious_activity',
  details: any
): Promise<void> => {
  console.log(`Security notification sent to ${email}:`, { type, details });
  // Mock email sending
};

// Session management
export const createSession = (userId: string): string => {
  const sessionId = Math.random().toString(36).substring(2);
  const session = {
    id: sessionId,
    userId,
    createdAt: new Date(),
    lastActivity: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
  
  localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));
  localStorage.setItem('currentSession', sessionId);
  return sessionId;
};

export const validateSession = (sessionId: string): boolean => {
  const sessionData = localStorage.getItem(`session_${sessionId}`);
  if (!sessionData) return false;
  
  const session = JSON.parse(sessionData);
  const now = new Date();
  
  return new Date(session.expiresAt) > now;
};

export const updateSessionActivity = (sessionId: string): void => {
  const sessionData = localStorage.getItem(`session_${sessionId}`);
  if (sessionData) {
    const session = JSON.parse(sessionData);
    session.lastActivity = new Date();
    localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));
  }
};