import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Download, HardDrive, Wifi } from 'lucide-react';
import { indexedDB, type LessonContent } from '../lib/indexedDB';
import { useOffline } from '../hooks/useOffline';

export const CacheManager: React.FC = () => {
  const [cachedLessons, setCachedLessons] = useState<LessonContent[]>([]);
  const [cacheSize, setCacheSize] = useState(0);
  const { status, clearCache } = useOffline();

  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = async () => {
    try {
      const lessons = await indexedDB.getCachedLessons();
      setCachedLessons(lessons);
      
      // Estimate cache size (rough calculation)
      const sizeInBytes = lessons.reduce((total, lesson) => {
        return total + JSON.stringify(lesson).length;
      }, 0);
      setCacheSize(sizeInBytes);
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await clearCache();
      await loadCachedData();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Offline Content Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cache Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Cached Lessons</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{cachedLessons.length}</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Storage Used</span>
            </div>
            <p className="text-lg font-bold text-green-900">{formatBytes(cacheSize)}</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Wifi className={`w-4 h-4 ${status.isOnline ? 'text-green-600' : 'text-red-600'}`} />
          <span className="text-sm">
            {status.isOnline ? 'Connected - Content syncing enabled' : 'Offline - Using cached content'}
          </span>
          {status.hasUnsyncedData && (
            <Badge variant="outline" className="ml-auto">
              Unsynced data
            </Badge>
          )}
        </div>

        {/* Cached Lessons List */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Cached Content</h4>
          {cachedLessons.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {cachedLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lesson.title}</p>
                    <p className="text-xs text-gray-500">
                      {lesson.language} • Cached {formatDate(lesson.cached_at)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {lesson.level}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">
              No cached content available
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            className="flex items-center gap-2"
            disabled={cachedLessons.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};