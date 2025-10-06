import React from 'react';
import { Button } from '../ui/button';
import { signInWithApple, signInWithFacebook } from '../../lib/socialAuth';
import { useAuth } from '../../contexts/AuthContext';

export const SocialLoginButtons: React.FC = () => {
  const { login } = useAuth();

  const handleSocialLogin = async (provider: string, userData: any) => {
    try {
      await login(userData.email, '', userData);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    }
  };

  const handleGoogleLogin = async () => {
    // Mock Google login for now
    const mockUser = {
      id: 'google_123',
      name: 'Google User',
      email: 'user@gmail.com',
      provider: 'google'
    };
    await handleSocialLogin('Google', mockUser);
  };

  const handleAppleLogin = async () => {
    const result = await signInWithApple();
    if (result.success && result.user) {
      await handleSocialLogin('Apple', result.user);
    }
  };

  const handleFacebookLogin = async () => {
    const result = await signInWithFacebook();
    if (result.success && result.user) {
      await handleSocialLogin('Facebook', result.user);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
          <span className="mr-2">🔍</span>
          Continue with Google
        </Button>
        <Button variant="outline" onClick={handleAppleLogin} className="w-full">
          <span className="mr-2">🍎</span>
          Continue with Apple
        </Button>
        <Button variant="outline" onClick={handleFacebookLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <span className="mr-2">📘</span>
          Continue with Facebook
        </Button>
      </div>
    </div>
  );
};