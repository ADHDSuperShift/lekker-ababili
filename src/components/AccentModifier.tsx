import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Globe, Target, TrendingUp, Volume2, Play, 
  Pause, RotateCcw, CheckCircle, AlertCircle 
} from 'lucide-react';

interface AccentModifierProps {
  currentAccent: string;
  targetAccent: string;
  similarity: number;
  improvements: string[];
}

interface AccentFeature {
  name: string;
  current: number;
  target: number;
  importance: 'high' | 'medium' | 'low';
  description: string;
}

export const AccentModifier: React.FC<AccentModifierProps> = ({
  currentAccent,
  targetAccent,
  similarity,
  improvements
}) => {
  const [selectedTarget, setSelectedTarget] = useState(targetAccent);
  const [isTraining, setIsTraining] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState(0);

  const accentFeatures: AccentFeature[] = [
    {
      name: 'Vowel Pronunciation',
      current: 65,
      target: 90,
      importance: 'high',
      description: 'Focus on /æ/ vs /ɑ/ sounds'
    },
    {
      name: 'Consonant Clarity',
      current: 78,
      target: 85,
      importance: 'medium',
      description: 'Work on /θ/ and /ð/ sounds'
    },
    {
      name: 'Intonation Pattern',
      current: 72,
      target: 88,
      importance: 'high',
      description: 'Rising and falling tones'
    },
    {
      name: 'Rhythm & Stress',
      current: 68,
      target: 82,
      importance: 'medium',
      description: 'Word and sentence stress patterns'
    },
    {
      name: 'Connected Speech',
      current: 60,
      target: 80,
      importance: 'low',
      description: 'Linking and reduction patterns'
    }
  ];

  const accentOptions = [
    { value: 'american', label: 'American English', flag: '🇺🇸' },
    { value: 'british', label: 'British English', flag: '🇬🇧' },
    { value: 'australian', label: 'Australian English', flag: '🇦🇺' },
    { value: 'canadian', label: 'Canadian English', flag: '🇨🇦' },
    { value: 'south_african', label: 'South African English', flag: '🇿🇦' }
  ];

  const exercises = [
    {
      title: 'Vowel Discrimination',
      description: 'Practice distinguishing between similar vowel sounds',
      duration: 30
    },
    {
      title: 'Consonant Clusters',
      description: 'Work on difficult consonant combinations',
      duration: 25
    },
    {
      title: 'Intonation Patterns',
      description: 'Practice rising and falling intonation',
      duration: 35
    },
    {
      title: 'Stress Patterns',
      description: 'Master word and sentence stress',
      duration: 20
    }
  ];

  const startTraining = () => {
    setIsTraining(true);
    setCurrentExercise(0);
    setExerciseProgress(0);
    
    // Simulate exercise progress
    const interval = setInterval(() => {
      setExerciseProgress(prev => {
        if (prev >= 100) {
          setCurrentExercise(curr => {
            if (curr >= exercises.length - 1) {
              setIsTraining(false);
              clearInterval(interval);
              return curr;
            }
            return curr + 1;
          });
          return 0;
        }
        return prev + 10;
      });
    }, 500);
  };

  const stopTraining = () => {
    setIsTraining(false);
    setExerciseProgress(0);
  };

  const resetTraining = () => {
    setIsTraining(false);
    setCurrentExercise(0);
    setExerciseProgress(0);
  };

  const getFeatureColor = (current: number, target: number) => {
    const gap = target - current;
    if (gap <= 5) return 'text-green-600';
    if (gap <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOverallProgress = () => {
    const totalGap = accentFeatures.reduce((sum, feature) => sum + (feature.target - feature.current), 0);
    const maxGap = accentFeatures.reduce((sum, feature) => sum + feature.target, 0) - accentFeatures.length * 50; // Assuming 50 as baseline
    return Math.max(0, 100 - (totalGap / maxGap) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Accent Modification Training</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Accent Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Target Accent:</span>
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accentOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center space-x-2">
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <span>Current Similarity to Target:</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{similarity}%</span>
                <Badge variant={similarity >= 80 ? 'default' : similarity >= 60 ? 'secondary' : 'destructive'}>
                  {similarity >= 80 ? 'Excellent' : similarity >= 60 ? 'Good' : 'Needs Work'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Accent Features Analysis */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Accent Features Analysis</span>
            </h4>
            
            <div className="space-y-3">
              {accentFeatures.map((feature, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{feature.name}</span>
                      <Badge className={`text-xs ${getImportanceColor(feature.importance)}`}>
                        {feature.importance}
                      </Badge>
                    </div>
                    <span className={`text-sm font-semibold ${getFeatureColor(feature.current, feature.target)}`}>
                      {feature.current}% / {feature.target}%
                    </span>
                  </div>
                  
                  <Progress value={(feature.current / feature.target) * 100} className="h-2 mb-2" />
                  
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Training Exercises */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Accent Training Exercises</h4>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isTraining ? "destructive" : "default"}
                  size="sm"
                  onClick={isTraining ? stopTraining : startTraining}
                >
                  {isTraining ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isTraining ? 'Stop' : 'Start'} Training
                </Button>
                
                <Button variant="outline" size="sm" onClick={resetTraining}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isTraining && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">
                    Exercise {currentExercise + 1}: {exercises[currentExercise]?.title}
                  </span>
                  <Badge variant="outline" className="animate-pulse">
                    Training Active
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {exercises[currentExercise]?.description}
                </p>
                
                <Progress value={exerciseProgress} className="h-3 mb-2" />
                <div className="text-xs text-gray-500 text-right">
                  {exerciseProgress}% Complete
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {exercises.map((exercise, index) => (
                <div 
                  key={index} 
                  className={`p-3 border rounded-lg ${
                    index === currentExercise && isTraining 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{exercise.title}</div>
                      <div className="text-xs text-gray-600">{exercise.description}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{exercise.duration}s</span>
                      {index < currentExercise && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Personalized Improvements</span>
            </h4>
            
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm">{improvement}</span>
                </div>
              ))}
            </div>
            
            {/* Overall Progress */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Overall Progress</span>
                <span className="text-sm font-semibold">{calculateOverallProgress().toFixed(0)}%</span>
              </div>
              <Progress value={calculateOverallProgress()} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};