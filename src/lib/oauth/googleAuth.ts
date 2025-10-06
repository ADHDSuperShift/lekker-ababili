// Google OAuth integration using @react-oauth/google
import { CredentialResponse } from '@react-oauth/google';

export interface GoogleAuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    provider: string;
  };
  error?: string;
}

// Decode JWT token from Google
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Handle Google OAuth success
export const handleGoogleSuccess = (credentialResponse: CredentialResponse): GoogleAuthResponse => {
  try {
    if (!credentialResponse.credential) {
      return {
        success: false,
        error: 'No credential received from Google'
      };
    }

    const userInfo = decodeJWT(credentialResponse.credential);
    
    if (!userInfo) {
      return {
        success: false,
        error: 'Failed to decode Google credential'
      };
    }

    return {
      success: true,
      user: {
        id: `google_${userInfo.sub}`,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture,
        provider: 'google'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to process Google authentication'
    };
  }
};

// Google OAuth configuration
export const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';