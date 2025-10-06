import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Trophy, Medal, Award, TrendingUp, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  streak: number;
  level: number;
  language: string;
  rank: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Maria Rodriguez', points: 2450, streak: 15, level: 8, language: 'Spanish', rank: 1 },
  { id: '2', name: 'Jean Dupont', points: 2380, streak: 12, level: 7, language: 'French', rank: 2 },
  { id: '3', name: 'Hans Mueller', points: 2290, streak: 8, level: 6, language: 'German', rank: 3 },
  { id: '4', name: 'You', points: 1850, streak: 5, level: 5, language: 'Spanish', rank: 4 },
  { id: '5', name: 'Li Wei', points: 1720, streak: 20, level: 4, language: 'Chinese', rank: 5 }
];

const achievements = [
  { id: '1', title: 'Week Warrior', description: '7-day streak', icon: '🔥', earned: true },
  { id: '2', title: 'Conversation Master', description: '100 chat sessions', icon: '💬', earned: true },
  { id: '3', title: 'Grammar Guru', description: 'Perfect grammar score', icon: '📝', earned: false },
  { id: '4', title: 'Cultural Explorer', description: 'Learn 5 cultural facts', icon: '🌍', earned: true }
];

export const Leaderboards: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leaderboards</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <TrendingUp className="h-3 w-3 mr-1" />
          Rank #4
        </Badge>
      </div>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Top Learners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLeaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === 'You' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(entry.rank)}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={`font-medium ${entry.name === 'You' ? 'text-blue-700' : ''}`}>
                          {entry.name}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Badge variant="outline" className="text-xs">{entry.language}</Badge>
                          <span>Level {entry.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.points.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        🔥 {entry.streak} days
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border text-center ${
                      achievement.earned
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h3 className="font-medium text-sm">{achievement.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};