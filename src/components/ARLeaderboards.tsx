import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import { LanguagePair } from './LanguageSelector';

interface ARLeaderboardsProps {
  languagePair: LanguagePair;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  gamesPlayed: number;
  accuracy: number;
  country: string;
  isMe?: boolean;
}

const ARLeaderboards: React.FC<ARLeaderboardsProps> = ({ languagePair }) => {
  const globalLeaders: LeaderboardEntry[] = [
    { rank: 1, name: 'Alex_Master', score: 15420, gamesPlayed: 89, accuracy: 94, country: '🇿🇦' },
    { rank: 2, name: 'Nina_Pro', score: 14850, gamesPlayed: 76, accuracy: 92, country: '🇳🇱' },
    { rank: 3, name: 'Sam_Legend', score: 14200, gamesPlayed: 82, accuracy: 90, country: '🇺🇸' },
    { rank: 4, name: 'You', score: 8450, gamesPlayed: 34, accuracy: 87, country: '🇿🇦', isMe: true },
    { rank: 5, name: 'Maria_AR', score: 7890, gamesPlayed: 45, accuracy: 89, country: '🇪🇸' }
  ];

  const weeklyLeaders: LeaderboardEntry[] = [
    { rank: 1, name: 'QuickShot_ZA', score: 2340, gamesPlayed: 12, accuracy: 96, country: '🇿🇦' },
    { rank: 2, name: 'You', score: 1890, gamesPlayed: 8, accuracy: 91, country: '🇿🇦', isMe: true },
    { rank: 3, name: 'FastEye_NL', score: 1650, gamesPlayed: 9, accuracy: 88, country: '🇳🇱' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold">#{rank}</span>;
    }
  };

  const LeaderboardTable = ({ leaders }: { leaders: LeaderboardEntry[] }) => (
    <div className="space-y-2">
      {leaders.map((entry) => (
        <Card key={entry.rank} className={entry.isMe ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRankIcon(entry.rank)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{entry.name}</span>
                    <span>{entry.country}</span>
                    {entry.isMe && <Badge variant="secondary">You</Badge>}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.gamesPlayed} games • {entry.accuracy}% accuracy
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{entry.score.toLocaleString()}</div>
                <div className="text-sm text-gray-500">points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {languagePair.from} → {languagePair.to} Leaderboards
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compete with players learning the same language pair
        </p>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">All Time</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-4">
          <LeaderboardTable leaders={globalLeaders} />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <LeaderboardTable leaders={weeklyLeaders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ARLeaderboards;