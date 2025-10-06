import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Star, Flame, Target, Users, Calendar, Gift, Crown, Zap, Award } from 'lucide-react';
import { GamificationEngine } from '../lib/gamificationEngine';

export const GamificationHub: React.FC = () => {
  const [gamificationEngine] = useState(() => GamificationEngine.getInstance());
  const [userStats, setUserStats] = useState(gamificationEngine.getUserStats());
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);

  useEffect(() => {
    setUserStats(gamificationEngine.getUserStats());
  }, [gamificationEngine]);

  const badges = gamificationEngine.getBadges();
  const challenges = gamificationEngine.getChallenges();
  const leaderboard = gamificationEngine.getLeaderboard();

  const skillTree = [
    { id: 'vocabulary', name: 'Vocabulary Master', level: 8, maxLevel: 10, xp: 1200 },
    { id: 'grammar', name: 'Grammar Guru', level: 6, maxLevel: 10, xp: 800 },
    { id: 'pronunciation', name: 'Pronunciation Pro', level: userStats.level, maxLevel: 10, xp: userStats.xp },
    { id: 'conversation', name: 'Conversation King', level: 5, maxLevel: 10, xp: 650 }
  ];

  const pronunciationChallenges = challenges.filter(c => c.type === 'pronunciation' || c.type === 'daily');

  return (
    <div className="space-y-6">
      {/* XP and Level Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Level {userStats.level} Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">XP: {userStats.xp}/{userStats.level * 1000}</span>
              <Badge variant="secondary">{(userStats.level * 1000) - userStats.xp} XP to next level</Badge>
            </div>
            <Progress value={(userStats.xp / (userStats.level * 1000)) * 100} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                  <Flame className="h-4 w-4" />
                  <span className="font-bold">{userStats.streak}</span>
                </div>
                <p className="text-xs text-gray-600">Day Streak</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-purple-500 mb-1">
                  <Award className="h-4 w-4" />
                  <span className="font-bold">{userStats.badges.length}</span>
                </div>
                <p className="text-xs text-gray-600">Badges</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">{userStats.weeklyXP}</span>
                </div>
                <p className="text-xs text-gray-600">Weekly XP</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="goals">Daily Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Pronunciation Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pronunciationChallenges.map(challenge => (
                <div key={challenge.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                    <Badge variant={challenge.difficulty === 'Hard' ? 'destructive' : 'secondary'}>
                      {challenge.xp} XP
                    </Badge>
                  </div>
                  <Button size="sm" className="mt-2">
                    Start Challenge
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Skill Tree
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillTree.map(skill => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{skill.name}</h3>
                    <Badge>Level {skill.level}/{skill.maxLevel}</Badge>
                  </div>
                  <Progress value={(skill.level / skill.maxLevel) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                Badges & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map(badge => {
                  const earned = userStats.badges.includes(badge.id);
                  return (
                    <div 
                      key={badge.id} 
                      className={`border rounded-lg p-4 text-center ${earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 opacity-60'}`}
                    >
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <h3 className="font-medium text-sm">{badge.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                      <Badge 
                        variant={earned ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {badge.rarity}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.name === 'You' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 text-center font-bold">#{entry.rank}</div>
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-sm text-gray-500">Level {entry.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{entry.points}</p>
                    <p className="text-sm text-gray-500">🔥 {entry.streak}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Daily Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userStats.dailyGoals.map(goal => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium capitalize">{goal.type.replace('_', ' ')} Goal</h3>
                    <Badge variant={goal.completed ? "default" : "secondary"}>
                      {goal.xp} XP
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      {goal.current}/{goal.target}
                    </span>
                    {goal.completed && <Badge variant="default">Completed!</Badge>}
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};