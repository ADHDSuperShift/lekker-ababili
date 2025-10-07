import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, Clock, Star, Lock } from 'lucide-react';

interface LessonListProps {
  language: string;
  onSelectLesson: (lessonId: string) => void;
}

export default function LessonList({ language, onSelectLesson }: LessonListProps) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, [language]);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const data = await supabaseHelpers.getLessons(language);
      setLessons(data || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediêr';
      case 'advanced':
        return 'Gevorderd';
      default:
        return difficulty;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Laai lesse...</p>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Geen lesse beskikbaar</h3>
          <p className="text-gray-600">
            Lesse vir hierdie taal is nog nie beskikbaar nie. Kom gou terug!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Beskikbare Lesse</h2>
          <p className="text-gray-600">{lessons.length} lesse gevind</p>
        </div>
      </div>

      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{lesson.title_af}</CardTitle>
                    {lesson.is_premium && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{lesson.description_af}</CardDescription>
                </div>
                <Badge className={getDifficultyColor(lesson.difficulty)}>
                  {getDifficultyText(lesson.difficulty)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration_minutes} minute</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>Les {lesson.order_index}</span>
                  </div>
                </div>
                <Button
                  onClick={() => onSelectLesson(lesson.id)}
                  disabled={lesson.is_premium}
                >
                  {lesson.is_premium ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Gesluit
                    </>
                  ) : (
                    'Begin Les'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
