import React from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useOffline } from '../hooks/useOffline';

export const OfflineIndicator: React.FC = () => {
  const { status, syncInProgress, syncData } = useOffline();

  if (status.isOnline && !status.hasUnsyncedData && !syncInProgress) {
    return null; // Don't show indicator when everything is normal
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {/* Connection Status */}
      <Badge 
        variant={status.isOnline ? "default" : "destructive"}
        className="flex items-center gap-2"
      >
        {status.isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Offline
          </>
        )}
      </Badge>

      {/* Sync Status */}
      {status.hasUnsyncedData && (
        <Badge variant="outline" className="flex items-center gap-2">
          {syncInProgress ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <CloudOff className="w-3 h-3" />
              Unsynced data
            </>
          )}
        </Badge>
      )}

      {/* Manual Sync Button */}
      {status.isOnline && status.hasUnsyncedData && !syncInProgress && (
        <Button
          size="sm"
          variant="outline"
          onClick={syncData}
          className="flex items-center gap-2"
        >
          <Cloud className="w-3 h-3" />
          Sync Now
        </Button>
      )}

      {/* Last Sync Time */}
      {status.lastSyncTime && (
        <div className="text-xs text-muted-foreground">
          Last sync: {new Date(status.lastSyncTime).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};