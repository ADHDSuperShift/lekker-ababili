import React from 'react';
import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google';
import { googleClientId } from '../../lib/oauth/googleAuth';

interface GoogleOAuthProviderProps {
  children: React.ReactNode;
}

export const GoogleOAuthProvider: React.FC<GoogleOAuthProviderProps> = ({ children }) => {
  return (
    <GoogleProvider clientId={googleClientId}>
      {children}
    </GoogleProvider>
  );
};