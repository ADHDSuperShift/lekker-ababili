import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressData {
  date: string;
  score: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
}

interface PronunciationProgressProps {
  progressData: ProgressData[];
  currentScore: number;
}

export const PronunciationProgress: React.FC<PronunciationProgressProps> = ({
  progressData,
  currentScore
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 75) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 60) return { label: 'Fair', variant: 'outline' as const };
    return { label: 'Needs Work', variant: 'destructive' as const };
  };

  const getTrend = () => {
    if (progressData.length < 2) return null;
    const recent = progressData.slice(-2);
    const diff = recent[1].score - recent[0].score;
    
    if (diff > 2) return { icon: TrendingUp, color: 'text-green-600', text: 'Improving' };
    if (diff < -2) return { icon: TrendingDown, color: 'text-red-600', text: 'Declining' };
    return { icon: Minus, color: 'text-gray-600', text: 'Stable' };
  };

  const trend = getTrend();
  const badge = getScoreBadge(currentScore);
  const recentData = progressData.slice(-5);

  return (
    <div className="space-y-4">
      {/* Current Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Score</span>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>
              {currentScore}%
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 ${trend.color}`}>
                <trend.icon className="h-4 w-4" />
                <span className="text-sm">{trend.text}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentData.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Accuracy</span>
                  <span>{recentData[recentData.length - 1].accuracy}%</span>
                </div>
                <Progress value={recentData[recentData.length - 1].accuracy} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fluency</span>
                  <span>{recentData[recentData.length - 1].fluency}%</span>
                </div>
                <Progress value={recentData[recentData.length - 1].fluency} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completeness</span>
                  <span>{recentData[recentData.length - 1].completeness}%</span>
                </div>
                <Progress value={recentData[recentData.length - 1].completeness} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prosody</span>
                  <span>{recentData[recentData.length - 1].prosody}%</span>
                </div>
                <Progress value={recentData[recentData.length - 1].prosody} className="h-2" />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Progress History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{data.date}</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {getScoreBadge(data.score).label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};