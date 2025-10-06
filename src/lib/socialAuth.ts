// Social authentication service
import { handleFacebookLogin, initFacebookSDK } from './oauth/facebookAuth';

export interface SocialAuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'apple' | 'facebook';
}

export interface SocialAuthResponse {
  success: boolean;
  user?: SocialAuthUser;
  error?: string;
}

// Social provider configurations
export const socialProviders = {
  google: {
    name: 'Google',
    icon: '🔍',
    color: 'bg-red-500 hover:bg-red-600',
    enabled: true
  },
  apple: {
    name: 'Apple',
    icon: '🍎',
    color: 'bg-black hover:bg-gray-800',
    enabled: true
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: 'bg-blue-600 hover:bg-blue-700',
    enabled: true
  }
};

// Initialize social auth providers
export const initSocialAuth = async () => {
  try {
    await initFacebookSDK();
  } catch (error) {
    console.error('Failed to initialize Facebook SDK:', error);
  }
};

// Sign in with Google (mock implementation)
export const signInWithGoogle = async (): Promise<SocialAuthResponse> => {
  return { 
    success: true, 
    user: {
      id: 'google_123',
      name: 'Google User',
      email: 'user@gmail.com',
      provider: 'google'
    }
  };
};

// Sign in with Apple (mock implementation)
export const signInWithApple = async (): Promise<SocialAuthResponse> => {
  return { 
    success: true, 
    user: {
      id: 'apple_123',
      name: 'Apple User',
      email: 'user@icloud.com',
      provider: 'apple'
    }
  };
};

// Sign in with Facebook (real implementation)
export const signInWithFacebook = async (): Promise<SocialAuthResponse> => {
  try {
    await initFacebookSDK();
    return await handleFacebookLogin();
  } catch (error) {
    return { success: false, error: 'Facebook sign-in failed' };
  }
};

// Sign out from all social providers
export const signOutFromSocial = async (provider: string) => {
  try {
    if (provider === 'facebook' && window.FB) {
      window.FB.logout();
    }
  } catch (error) {
    console.error(`Failed to sign out from ${provider}:`, error);
  }
};