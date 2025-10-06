import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Users, Clock, Target, BookOpen } from 'lucide-react';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = {
    userEngagement: {
      dailyActive: 2156,
      weeklyActive: 8932,
      monthlyActive: 15420,
      avgSessionTime: '18m 32s',
      retentionRate: 73.2,
      bounceRate: 12.8
    },
    learningProgress: {
      lessonsCompleted: 45678,
      avgLessonsPerUser: 12.3,
      completionRate: 87.5,
      streakMaintenance: 64.2,
      skillProgression: 78.9
    },
    contentPerformance: {
      topLanguages: [
        { language: 'Spanish', users: 4250, growth: 15.2 },
        { language: 'French', users: 3890, growth: 12.8 },
        { language: 'German', users: 2340, growth: 8.5 },
        { language: 'Italian', users: 1890, growth: 22.1 },
        { language: 'Portuguese', users: 1450, growth: 18.7 }
      ],
      challengeEngagement: [
        { type: 'Vocabulary', participation: 89.2, completion: 76.5 },
        { type: 'Grammar', participation: 72.8, completion: 68.3 },
        { type: 'Speaking', participation: 65.4, completion: 71.2 },
        { type: 'Listening', participation: 78.9, completion: 82.1 },
        { type: 'Writing', participation: 58.7, completion: 64.8 }
      ]
    }
  };

  const getTrendIcon = (value: number) => {
    return value > 0 ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getTrendColor = (value: number) => {
    return value > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last Day</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.userEngagement.dailyActive.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Daily Active Users</div>
              <div className="flex items-center justify-center gap-1 mt-1 text-sm text-green-600">
                {getTrendIcon(8.2)}
                +8.2%
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.userEngagement.avgSessionTime}</div>
              <div className="text-sm text-gray-500">Avg Session Time</div>
              <div className="flex items-center justify-center gap-1 mt-1 text-sm text-green-600">
                {getTrendIcon(12.5)}
                +12.5%
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.userEngagement.retentionRate}%</div>
              <div className="text-sm text-gray-500">Retention Rate</div>
              <div className="flex items-center justify-center gap-1 mt-1 text-sm text-green-600">
                {getTrendIcon(2.1)}
                +2.1%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{metrics.learningProgress.lessonsCompleted.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{metrics.learningProgress.completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{metrics.learningProgress.streakMaintenance}%</div>
              <div className="text-sm text-gray-600">Streak Maintenance</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{metrics.learningProgress.avgLessonsPerUser}</div>
              <div className="text-sm text-gray-600">Avg Lessons/User</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.contentPerformance.topLanguages.map((lang, index) => (
                <div key={lang.language} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{lang.language}</div>
                      <div className="text-sm text-gray-500">{lang.users.toLocaleString()} users</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(lang.growth)}`}>
                    {getTrendIcon(lang.growth)}
                    +{lang.growth}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenge Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.contentPerformance.challengeEngagement.map((challenge) => (
                <div key={challenge.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{challenge.type}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">{challenge.participation}% participation</Badge>
                      <Badge variant="secondary">{challenge.completion}% completion</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${challenge.completion}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}