import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AccountCreationProps {
  onComplete: () => void;
  onBack: () => void;
}

const AccountCreation: React.FC<AccountCreationProps> = ({ onComplete, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && name) {
      onComplete();
    }
  };

  const handleSocialSignin = (provider: string) => {
    // Mock social sign-in
    console.log(`Signing in with ${provider}`);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="p-2">
            ←
          </Button>
          <div className="flex-1 text-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full w-full" />
            </div>
            <p className="text-sm text-gray-600">Step 3 of 3</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Create your account
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Join thousands learning languages with Lekker Ababili
          </p>

          {/* Social Sign-in Options */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 text-left justify-start"
              onClick={() => handleSocialSignin('google')}
            >
              <span className="text-xl mr-3">🌐</span>
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-12 text-left justify-start"
              onClick={() => handleSocialSignin('apple')}
            >
              <span className="text-xl mr-3">🍎</span>
              Continue with Apple
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
              required
            />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              required
            />
            
            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              Create Account
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountCreation;