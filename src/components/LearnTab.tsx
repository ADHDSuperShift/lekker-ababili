import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, Play, Download, Wifi, WifiOff, Volume2, Mic } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../hooks/useOffline';
import { indexedDB } from '../lib/indexedDB';
import { LessonManager } from './LessonManager';
import { TTSPlayer } from './TTSPlayer';
import { PronunciationAssessment } from './PronunciationAssessment';

export const LearnTab: React.FC = () => {
  const [cachedLessons, setCachedLessons] = useState<any[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { isOffline } = useOffline();

  useEffect(() => {
    loadCachedLessons();
  }, []);

  const loadCachedLessons = async () => {
    try {
      const lessons = await indexedDB.getAllLessons();
      setCachedLessons(lessons);
    } catch (error) {
      console.error('Failed to load cached lessons:', error);
    }
  };

  const pronunciationLessons = [
    {
      id: 1,
      title: 'Basic Greetings',
      language: 'afrikaans',
      phrases: [
        'Hallo, hoe gaan dit?',
        'Goeie môre!',
        'Baie dankie',
        'Tot siens'
      ]
    },
    {
      id: 2,
      title: 'Zulu Basics',
      language: 'zulu',
      phrases: [
        'Sawubona',
        'Unjani?',
        'Ngiyabonga',
        'Sala kahle'
      ]
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Learning Center</h2>
          <p className="text-gray-600">
            {isAuthenticated ? 'Cloud-synced lessons' : 'Offline mode'} 
            {isOffline && <WifiOff className="inline h-4 w-4 ml-2 text-red-500" />}
            {!isOffline && <Wifi className="inline h-4 w-4 ml-2 text-green-500" />}
          </p>
        </div>
        
        {user && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Level {user.progress.level}</p>
            <p className="text-sm font-medium">{user.progress.wordsLearned} words learned</p>
          </div>
        )}
      </div>
      
      {user && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Daily Progress</span>
            <span className="text-sm text-gray-600">
              {Math.min(user.progress.wordsLearned % 20, 20)}/20 words
            </span>
          </div>
          <Progress 
            value={(user.progress.wordsLearned % 20) * 5} 
            className="h-2"
          />
        </div>
      )}

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation Training</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lessons">
          {isAuthenticated ? (
            <LessonManager />
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <WifiOff className="h-5 w-5 mr-2 text-red-500" />
                    Offline Mode
                  </CardTitle>
                  <CardDescription>
                    You're currently offline. Showing cached lessons only.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cachedLessons.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {cachedLessons.slice(0, 4).map((lesson) => (
                        <Card key={lesson.id} className="border-dashed">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Download className="h-4 w-4 mr-2 text-blue-500" />
                              {lesson.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-3">
                              Cached offline lesson
                            </p>
                            <Button size="sm" className="w-full">
                              <Play className="h-4 w-4 mr-2" />
                              Start Offline
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No cached lessons available</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Connect to the internet to download lessons
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pronunciation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="h-5 w-5 mr-2" />
                  Pronunciation Training
                </CardTitle>
                <CardDescription>
                  Practice your pronunciation with AI-powered feedback and progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {pronunciationLessons.map((lesson) => (
                    <Card key={lesson.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-lg capitalize">
                          {lesson.title} - {lesson.language}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {lesson.phrases.map((phrase, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h4 className="font-medium mb-2">Phrase {index + 1}</h4>
                              <PronunciationAssessment
                                text={phrase}
                                language={lesson.language}
                                onScoreUpdate={(score) => {
                                  console.log(`Score for "${phrase}":`, score);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};