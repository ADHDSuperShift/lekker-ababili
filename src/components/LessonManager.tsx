import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Play, CheckCircle, Clock, Volume2 } from 'lucide-react';
import { apiService, Lesson } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { TTSPlayer } from './TTSPlayer';
export const LessonManager: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { user, isAuthenticated, updateProgress } = useAuth();
  const { data, loading, error, execute } = useApi<{ lessons: Lesson[]; total: number }>();

  useEffect(() => {
    loadLessons();
  }, [selectedCategory, selectedDifficulty]);

  const loadLessons = () => {
    const params: any = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedDifficulty !== 'all') params.difficulty = selectedDifficulty;
    
    execute(() => apiService.getLessons(params), (data) => {
      setLessons(data.lessons);
    });
  };

  const handleStartLesson = async (lesson: Lesson) => {
    if (!user) return;

    // Simulate lesson completion for demo
    const score = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    try {
      if (isAuthenticated) {
        await apiService.completeLesson(lesson.id, score);
      }
      
      // Update local progress
      const newWordsLearned = lesson.content.vocabulary.length;
      const progressUpdate = {
        wordsLearned: user.progress.wordsLearned + newWordsLearned,
        level: Math.floor((user.progress.wordsLearned + newWordsLearned) / 100) + 1,
      };
      
      await updateProgress(progressUpdate);
      
      alert(`Lesson completed! Score: ${score}%`);
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['all', 'vocabulary', 'grammar', 'conversation', 'pronunciation'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading lessons...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load lessons: {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadLessons}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{lesson.title}</CardTitle>
                <Badge className={getDifficultyColor(lesson.difficulty)}>
                  {lesson.difficulty}
                </Badge>
              </div>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {lesson.estimatedTime} min
                </span>
                <span>{lesson.content.vocabulary.length} words</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>

              <TTSPlayer 
                text={lesson.description}
                language="en"
                className="mb-3"
              />
              
              <Button 
                onClick={() => handleStartLesson(lesson)}
                className="w-full"
                disabled={!user}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Lesson
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {lessons.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No lessons found for the selected filters.
        </div>
      )}
    </div>
  );
};