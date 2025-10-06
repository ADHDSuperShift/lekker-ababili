import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Brain, Target, TrendingUp, BookOpen, Play, Lock } from 'lucide-react';
import { AdaptiveLearningEngine, UserPerformanceData, LearningRecommendation, LearningPath } from '../lib/adaptiveLearning';

interface AdaptiveLearningProps {
  userId: string;
  language: string;
}

export const AdaptiveLearning: React.FC<AdaptiveLearningProps> = ({ userId, language }) => {
  const [performanceData, setPerformanceData] = useState<UserPerformanceData | null>(null);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  
  const engine = new AdaptiveLearningEngine();

  useEffect(() => {
    loadUserData();
  }, [userId, language]);

  const loadUserData = () => {
    const stored = localStorage.getItem(`adaptive_learning_${userId}_${language}`);
    if (stored) {
      const data = JSON.parse(stored);
      setPerformanceData(data);
      
      const analysisResult = engine.analyzePerformance(data);
      setAnalysis(analysisResult);
      setRecommendations(analysisResult.recommendations);
      
      const path = engine.generatePersonalizedPath(data);
      setLearningPath(path);
    }
  };

  const startRecommendation = (rec: LearningRecommendation) => {
    console.log('Starting recommendation:', rec.title);
  };

  const startLesson = (lessonId: string) => {
    console.log('Starting lesson:', lessonId);
  };

  if (!performanceData || !analysis) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Complete a few pronunciation assessments to unlock personalized learning!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.overallProgress}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analysis.strengths.length}</div>
              <div className="text-sm text-gray-600">Strengths</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysis.weakAreas.length}</div>
              <div className="text-sm text-gray-600">Areas to Improve</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{performanceData.difficultyLevel}</div>
              <div className="text-sm text-gray-600">Difficulty Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{rec.estimatedTime} min</Badge>
                    <Badge variant={rec.difficulty > 3 ? 'destructive' : 'secondary'}>
                      Level {rec.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button onClick={() => startRecommendation(rec)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      {learningPath && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Your Learning Path</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{learningPath.name}</h4>
                <Badge>{learningPath.targetLevel}</Badge>
              </div>
              <Progress value={(learningPath.lessons.filter(l => l.isCompleted).length / learningPath.lessons.length) * 100} />
              
              <div className="space-y-3">
                {learningPath.lessons.slice(0, 4).map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      {lesson.isUnlocked ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <h5 className="font-medium">{lesson.title}</h5>
                        <p className="text-sm text-gray-600">{lesson.estimatedTime} min</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!lesson.isUnlocked}
                      onClick={() => startLesson(lesson.id)}
                    >
                      {lesson.isCompleted ? 'Review' : 'Start'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};