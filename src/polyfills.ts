// Polyfills for browser environment

// Set up global polyfills
if (typeof window !== 'undefined') {
  (window as any).global = (window as any).global || window;
  
  if (!(window as any).process) {
    (window as any).process = {
      env: {
        NODE_ENV: 'development',
        REACT_APP_FACEBOOK_APP_ID: 'your_facebook_app_id',
        REACT_APP_GOOGLE_CLIENT_ID: 'your_google_client_id',
        REACT_APP_APPLE_CLIENT_ID: 'your_apple_client_id',
        REACT_APP_STRIPE_PUBLISHABLE_KEY: 'pk_test_example',
        REACT_APP_API_URL: 'http://localhost:3001/api',
        REACT_APP_NARAKEET_API_KEY: 'demo-narakeet-key',
        REACT_APP_LOVO_API_KEY: 'demo-lovo-key',
        REACT_APP_MOONPAY_API_KEY: 'demo-moonpay-key',
        REACT_APP_MOONPAY_SECRET_KEY: 'demo-moonpay-secret',
      },
      platform: 'linux' as const,
      version: 'v18.0.0',
    };
  }
}

export {};
