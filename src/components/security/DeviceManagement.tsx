import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Device, getCurrentDevice } from '../../lib/security';
import { Smartphone, Monitor, Tablet, MapPin, Clock, AlertTriangle } from 'lucide-react';

export const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Mock devices data
    const mockDevices: Device[] = [
      getCurrentDevice(),
      {
        id: 'device-2',
        name: 'iPhone 14',
        type: 'mobile',
        browser: 'Safari',
        os: 'iOS',
        location: 'New York, NY',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isCurrent: false
      },
      {
        id: 'device-3',
        name: 'MacBook Pro',
        type: 'desktop',
        browser: 'Chrome',
        os: 'macOS',
        location: 'San Francisco, CA',
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isCurrent: false
      }
    ];
    setDevices(mockDevices);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Active now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleLogoutAllDevices = () => {
    setDevices(devices.filter(d => d.isCurrent));
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Management</CardTitle>
          <CardDescription>
            Manage devices that have access to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAlert && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Device access has been revoked successfully.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-gray-600">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{device.name}</h3>
                      {device.isCurrent && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span>{device.browser} on {device.os}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{device.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatLastActive(device.lastActive)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {!device.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveDevice(device.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          {devices.filter(d => !d.isCurrent).length > 0 && (
            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                onClick={handleLogoutAllDevices}
                className="w-full"
              >
                Log out all other devices
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};