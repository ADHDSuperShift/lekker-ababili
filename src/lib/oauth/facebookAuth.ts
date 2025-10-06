// Facebook OAuth integration
export interface FacebookAuthResponse {
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

// Facebook SDK configuration
export const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';

// Initialize Facebook SDK
export const initFacebookSDK = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve();
      return;
    }

    window.fbAsyncInit = function() {
      window.FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    // Load Facebook SDK
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.head.appendChild(script);
  });
};

// Handle Facebook login
export const handleFacebookLogin = (): Promise<FacebookAuthResponse> => {
  return new Promise((resolve) => {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        // Get user info
        window.FB.api('/me', { fields: 'name,email,picture' }, (userInfo: any) => {
          resolve({
            success: true,
            user: {
              id: `facebook_${userInfo.id}`,
              name: userInfo.name,
              email: userInfo.email,
              avatar: userInfo.picture?.data?.url,
              provider: 'facebook'
            }
          });
        });
      } else {
        resolve({
          success: false,
          error: 'Facebook login cancelled or failed'
        });
      }
    }, { scope: 'email' });
  });
};

// Facebook logout
export const handleFacebookLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    window.FB.logout(() => {
      resolve();
    });
  });
};

// Type declarations for Facebook SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}