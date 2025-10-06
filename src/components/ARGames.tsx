import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Target, Users, Clock, Star, Zap, Crown, Medal } from 'lucide-react';
import ScavengerHunt from './ScavengerHunt';
import TimedChallenge from './TimedChallenge';
import MultiplayerArena from './MultiplayerArena';
import ARLeaderboards from './ARLeaderboards';
import AchievementSystem from './AchievementSystem';
import { LanguagePair } from './LanguageSelector';

interface ARGamesProps {
  selectedLanguagePair: LanguagePair;
  onGameComplete: (gameType: string, score: number, timeElapsed?: number) => void;
}

export interface GameSession {
  id: string;
  type: 'scavenger' | 'timed' | 'multiplayer';
  score: number;
  timeElapsed: number;
  objectsFound: number;
  accuracy: number;
  languagePair: LanguagePair;
  completedAt: string;
}

const ARGames: React.FC<ARGamesProps> = ({ selectedLanguagePair, onGameComplete }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  const handleGameComplete = useCallback((gameType: string, score: number, timeElapsed: number = 0, objectsFound: number = 0, accuracy: number = 0) => {
    const session: GameSession = {
      id: `game_${Date.now()}`,
      type: gameType as 'scavenger' | 'timed' | 'multiplayer',
      score,
      timeElapsed,
      objectsFound,
      accuracy,
      languagePair: selectedLanguagePair,
      completedAt: new Date().toISOString()
    };

    setGameHistory(prev => [session, ...prev.slice(0, 9)]);
    setCurrentStreak(prev => score > 70 ? prev + 1 : 0);
    setActiveGame(null);
    onGameComplete(gameType, score, timeElapsed);
  }, [selectedLanguagePair, onGameComplete]);

  const gameTypes = [
    {
      id: 'scavenger',
      title: 'Scavenger Hunt',
      description: 'Find specific objects in your environment',
      icon: Target,
      difficulty: 'Easy',
      duration: '5-10 min',
      xp: '50-150 XP',
      color: 'bg-green-500'
    },
    {
      id: 'timed',
      title: 'Speed Challenge',
      description: 'Translate as many objects as possible',
      icon: Clock,
      difficulty: 'Medium',
      duration: '2-5 min',
      xp: '75-200 XP',
      color: 'bg-blue-500'
    },
    {
      id: 'multiplayer',
      title: 'AR Battle',
      description: 'Compete with other players in real-time',
      icon: Users,
      difficulty: 'Hard',
      duration: '3-8 min',
      xp: '100-300 XP',
      color: 'bg-purple-500'
    }
  ];

  if (activeGame) {
    switch (activeGame) {
      case 'scavenger':
        return (
          <ScavengerHunt
            languagePair={selectedLanguagePair}
            onComplete={handleGameComplete}
            onExit={() => setActiveGame(null)}
          />
        );
      case 'timed':
        return (
          <TimedChallenge
            languagePair={selectedLanguagePair}
            onComplete={handleGameComplete}
            onExit={() => setActiveGame(null)}
          />
        );
      case 'multiplayer':
        return (
          <MultiplayerArena
            languagePair={selectedLanguagePair}
            onComplete={handleGameComplete}
            onExit={() => setActiveGame(null)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            AR Learning Games
          </CardTitle>
          <p className="opacity-90">Gamified object recognition and translation challenges</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {gameTypes.map((game) => {
              const IconComponent = game.icon;
              return (
                <Card key={game.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveGame(game.id)}>
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{game.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{game.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant={game.difficulty === 'Easy' ? 'default' : game.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                        {game.difficulty}
                      </Badge>
                      <Badge variant="outline">{game.duration}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">{game.xp}</span>
                      <Button size="sm">Play Now</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{gameHistory.length}</div>
                    <div className="text-sm text-gray-600">Games Played</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{currentStreak}</div>
                    <div className="text-sm text-gray-600">Current Streak</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {gameHistory.length > 0 ? Math.round(gameHistory.reduce((acc, game) => acc + game.score, 0) / gameHistory.length) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Avg Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {gameHistory.reduce((acc, game) => acc + game.objectsFound, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Objects Found</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leaderboards">
              <ARLeaderboards languagePair={selectedLanguagePair} />
            </TabsContent>

            <TabsContent value="achievements">
              <AchievementSystem gameHistory={gameHistory} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARGames;