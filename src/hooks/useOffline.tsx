import { useState, useEffect } from 'react';
import { indexedDB, type OfflineProgress } from '../lib/indexedDB';

export interface OfflineStatus {
  isOnline: boolean;
  isOffline: boolean;
  hasUnsyncedData: boolean;
  lastSyncTime: number | null;
}

export const useOffline = () => {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    hasUnsyncedData: false,
    lastSyncTime: null
  });

  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true, isOffline: false }));
      syncData();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false, isOffline: true }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for unsynced data on mount
    checkUnsyncedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkUnsyncedData = async () => {
    try {
      const unsyncedProgress = await indexedDB.getUnsyncedProgress();
      setStatus(prev => ({
        ...prev,
        hasUnsyncedData: unsyncedProgress.length > 0
      }));
    } catch (error) {
      console.error('Error checking unsynced data:', error);
    }
  };

  const syncData = async () => {
    if (!navigator.onLine || syncInProgress) return;

    setSyncInProgress(true);
    try {
      const unsyncedProgress = await indexedDB.getUnsyncedProgress();
      
      if (unsyncedProgress.length > 0) {
        // In a real app, you'd send this to your backend
        console.log('Syncing progress data:', unsyncedProgress);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mark as synced
        const progressIds = unsyncedProgress.map(p => p.id);
        await indexedDB.markProgressSynced(progressIds);
        
        setStatus(prev => ({
          ...prev,
          hasUnsyncedData: false,
          lastSyncTime: Date.now()
        }));
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  const saveOfflineProgress = async (lessonId: string, progress: number, completed: boolean) => {
    const offlineProgress: OfflineProgress = {
      id: `${lessonId}-${Date.now()}`,
      lesson_id: lessonId,
      progress,
      completed,
      timestamp: Date.now(),
      synced: false
    };

    try {
      await indexedDB.saveOfflineProgress(offlineProgress);
      setStatus(prev => ({ ...prev, hasUnsyncedData: true }));
      
      // Try to sync immediately if online
      if (navigator.onLine) {
        syncData();
      }
    } catch (error) {
      console.error('Error saving offline progress:', error);
    }
  };

  const clearCache = async () => {
    try {
      await indexedDB.clearOldCache();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return {
    status,
    syncInProgress,
    saveOfflineProgress,
    syncData,
    clearCache,
    checkUnsyncedData
  };
};