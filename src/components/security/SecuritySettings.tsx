import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { TwoFactorSetup } from './TwoFactorSetup';
import { DeviceManagement } from './DeviceManagement';
import { LoginHistory } from './LoginHistory';
import { SecuritySettings as SecuritySettingsType } from '../../lib/security';
import { Shield, Mail, Clock, Eye, Key } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettingsType>({
    twoFactorEnabled: false,
    emailNotifications: true,
    sessionTimeout: 24,
    suspiciousActivityDetection: true
  });
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSettingChange = (key: keyof SecuritySettingsType, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordReset = () => {
    // Mock password reset
    console.log('Password reset sent to:', resetEmail);
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setShowPasswordReset(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <TwoFactorSetup
        isEnabled={settings.twoFactorEnabled}
        onToggle={(enabled) => handleSettingChange('twoFactorEnabled', enabled)}
      />

      {/* Security Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Preferences
          </CardTitle>
          <CardDescription>
            Configure your security and notification settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-gray-600">
                Receive email alerts for new logins and security events
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Suspicious Activity Detection
              </Label>
              <p className="text-sm text-gray-600">
                Monitor and alert on unusual login patterns
              </p>
            </div>
            <Switch
              checked={settings.suspiciousActivityDetection}
              onCheckedChange={(checked) => handleSettingChange('suspiciousActivityDetection', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Session Timeout (hours)
            </Label>
            <Input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              min="1"
              max="168"
              className="w-32"
            />
            <p className="text-sm text-gray-600">
              Automatically log out after period of inactivity
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Password Management
          </CardTitle>
          <CardDescription>
            Reset your password or update security credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPasswordReset ? (
            <Button onClick={() => setShowPasswordReset(true)}>
              Reset Password
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              {resetSent && (
                <Alert>
                  <AlertDescription>
                    Password reset instructions have been sent to your email.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setShowPasswordReset(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handlePasswordReset} disabled={!resetEmail}>
                  Send Reset Link
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Management */}
      <DeviceManagement />

      {/* Login History */}
      <LoginHistory />
    </div>
  );
};