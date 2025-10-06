import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { LoginHistory as LoginHistoryType } from '../../lib/security';
import { MapPin, Clock, Shield, AlertTriangle, Download } from 'lucide-react';

export const LoginHistory: React.FC = () => {
  const [history, setHistory] = useState<LoginHistoryType[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Mock login history data
    const mockHistory: LoginHistoryType[] = [
      {
        id: '1',
        timestamp: new Date(),
        device: 'Chrome on Windows',
        location: 'New York, NY',
        ipAddress: '192.168.1.1',
        success: true,
        suspicious: false
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        device: 'Safari on iPhone',
        location: 'New York, NY',
        ipAddress: '192.168.1.2',
        success: true,
        suspicious: false
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        device: 'Chrome on macOS',
        location: 'San Francisco, CA',
        ipAddress: '10.0.0.1',
        success: false,
        suspicious: true
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        device: 'Firefox on Linux',
        location: 'Los Angeles, CA',
        ipAddress: '203.0.113.1',
        success: true,
        suspicious: false
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        device: 'Chrome on Android',
        location: 'Chicago, IL',
        ipAddress: '198.51.100.1',
        success: true,
        suspicious: true
      }
    ];
    setHistory(mockHistory);
  }, []);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const exportHistory = () => {
    const csvContent = [
      'Timestamp,Device,Location,IP Address,Status,Suspicious',
      ...history.map(h => 
        `${h.timestamp.toISOString()},${h.device},${h.location},${h.ipAddress},${h.success ? 'Success' : 'Failed'},${h.suspicious ? 'Yes' : 'No'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'login-history.csv';
    a.click();
  };

  const displayedHistory = showAll ? history : history.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Login History</CardTitle>
            <CardDescription>
              Recent login attempts and activity
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportHistory}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {displayedHistory.map((login) => (
            <div
              key={login.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                login.suspicious ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  login.success 
                    ? login.suspicious 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {login.suspicious ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : login.success ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{login.device}</span>
                    <Badge 
                      variant={login.success ? 'secondary' : 'destructive'}
                      className={login.success ? 'bg-green-100 text-green-800' : ''}
                    >
                      {login.success ? 'Success' : 'Failed'}
                    </Badge>
                    {login.suspicious && (
                      <Badge variant="destructive">
                        Suspicious
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{login.location}</span>
                      </div>
                      <span>IP: {login.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(login.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {history.length > 5 && (
          <div className="text-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All (${history.length} total)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};