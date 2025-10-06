import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { generate2FASecret, generateQRCode, verify2FACode, generateBackupCodes } from '../../lib/security';
import { Shield, Copy, Download } from 'lucide-react';

interface TwoFactorSetupProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ isEnabled, onToggle }) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEnabled && step === 'setup') {
      const newSecret = generate2FASecret();
      setSecret(newSecret);
      setQrCode(generateQRCode(newSecret, 'user@example.com'));
    }
  }, [isEnabled, step]);

  const handleVerify = () => {
    if (verify2FACode(verificationCode, secret)) {
      setStep('backup');
      setBackupCodes(generateBackupCodes());
      setError('');
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleComplete = () => {
    onToggle(true);
    setStep('setup');
  };

  const handleDisable = () => {
    onToggle(false);
    setStep('setup');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
  };

  if (isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            2FA is currently enabled for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Enabled
              </Badge>
              <p className="text-sm text-gray-600 mt-1">
                Your account is protected with two-factor authentication
              </p>
            </div>
            <Button variant="outline" onClick={handleDisable}>
              Disable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Set up Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'setup' && (
          <div className="space-y-4">
            <div className="text-center">
              <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Scan this QR code with your authenticator app
              </p>
              <div className="flex items-center gap-2 justify-center">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">{secret}</code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(secret)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button onClick={() => setStep('verify')} className="w-full">
              Continue to Verification
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="verification">Enter verification code</Label>
              <Input
                id="verification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button onClick={() => setStep('setup')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerify} className="flex-1">
                Verify
              </Button>
            </div>
          </div>
        )}

        {step === 'backup' && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </AlertDescription>
            </Alert>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white p-2 rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadBackupCodes} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};