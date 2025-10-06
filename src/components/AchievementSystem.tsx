import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Star, Target, Zap, Crown, Medal } from 'lucide-react';
import { GameSession } from './ARGames';

interface AchievementSystemProps {
  gameHistory: GameSession[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  xpReward: number;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ gameHistory }) => {
  const totalGames = gameHistory.length;
  const totalScore = gameHistory.reduce((sum, game) => sum + game.score, 0);
  const avgScore = totalGames > 0 ? totalScore / totalGames : 0;
  const highScore = Math.max(...gameHistory.map(g => g.score), 0);
  const perfectGames = gameHistory.filter(g => g.accuracy >= 95).length;

  const achievements: Achievement[] = [
    {
      id: 'first_game',
      title: 'First Steps',
      description: 'Complete your first AR game',
      icon: <Star className="h-6 w-6" />,
      rarity: 'Common',
      progress: Math.min(totalGames, 1),
      maxProgress: 1,
      unlocked: totalGames >= 1,
      xpReward: 50
    },
    {
      id: 'game_veteran',
      title: 'Game Veteran',
      description: 'Play 25 AR games',
      icon: <Trophy className="h-6 w-6" />,
      rarity: 'Rare',
      progress: Math.min(totalGames, 25),
      maxProgress: 25,
      unlocked: totalGames >= 25,
      xpReward: 200
    },
    {
      id: 'high_scorer',
      title: 'High Scorer',
      description: 'Achieve a score of 1000+ in any game',
      icon: <Target className="h-6 w-6" />,
      rarity: 'Rare',
      progress: highScore >= 1000 ? 1 : 0,
      maxProgress: 1,
      unlocked: highScore >= 1000,
      xpReward: 150
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete 5 games with 95%+ accuracy',
      icon: <Zap className="h-6 w-6" />,
      rarity: 'Epic',
      progress: Math.min(perfectGames, 5),
      maxProgress: 5,
      unlocked: perfectGames >= 5,
      xpReward: 300
    },
    {
      id: 'ar_legend',
      title: 'AR Legend',
      description: 'Maintain 90+ average score over 50 games',
      icon: <Crown className="h-6 w-6" />,
      rarity: 'Legendary',
      progress: totalGames >= 50 && avgScore >= 90 ? 1 : 0,
      maxProgress: 1,
      unlocked: totalGames >= 50 && avgScore >= 90,
      xpReward: 500
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-500';
      case 'Rare': return 'bg-blue-500';
      case 'Epic': return 'bg-purple-500';
      case 'Legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{unlockedCount}/{achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalXP}</div>
            <div className="text-sm text-gray-600">Achievement XP</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`transition-all ${achievement.unlocked ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'opacity-75'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {achievement.unlocked ? achievement.icon : <Medal className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                      {achievement.rarity}
                    </Badge>
                    {achievement.unlocked && (
                      <Badge variant="outline" className="text-yellow-600">
                        +{achievement.xpReward} XP
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AchievementSystem;