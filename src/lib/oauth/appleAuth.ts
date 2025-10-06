// Apple Sign In integration using Apple JavaScript SDK
declare global {
  interface Window {
    AppleID: any;
  }
}

export interface AppleAuthResponse {
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

// Initialize Apple Sign In SDK
export const initAppleSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if SDK is already loaded
    if (window.AppleID) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = () => {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_CLIENT_ID || 'YOUR_APPLE_CLIENT_ID',
        scope: 'name email',
        redirectURI: window.location.origin,
        state: 'apple-signin',
        usePopup: true
      });
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Apple SDK'));
    
    document.head.appendChild(script);
  });
};

// Apple Sign In
export const signInWithApple = async (): Promise<AppleAuthResponse> => {
  try {
    await initAppleSDK();

    const response = await window.AppleID.auth.signIn();
    
    if (response.authorization) {
      const { code, id_token } = response.authorization;
      
      // Decode the identity token to get user info
      const userInfo = response.user || {};
      
      return {
        success: true,
        user: {
          id: `apple_${userInfo.id || Math.random().toString(36).substr(2, 9)}`,
          name: userInfo.name ? `${userInfo.name.firstName} ${userInfo.name.lastName}` : 'Apple User',
          email: userInfo.email || 'user@privaterelay.appleid.com',
          avatar: undefined, // Apple doesn't provide profile pictures
          provider: 'apple'
        }
      };
    } else {
      return {
        success: false,
        error: 'Apple Sign In was cancelled'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Apple Sign In failed'
    };
  }
};