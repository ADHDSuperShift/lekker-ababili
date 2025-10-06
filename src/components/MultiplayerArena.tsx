import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, Trophy, X, Crown } from 'lucide-react';
import { LanguagePair } from './LanguageSelector';

interface MultiplayerArenaProps {
  languagePair: LanguagePair;
  onComplete: (gameType: string, score: number, timeElapsed: number, objectsFound: number, accuracy: number) => void;
  onExit: () => void;
}

interface Player {
  id: string;
  name: string;
  score: number;
  objectsFound: number;
  isMe: boolean;
}

const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({ languagePair, onComplete, onExit }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [myScore, setMyScore] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const mockPlayers: Player[] = [
    { id: '1', name: 'You', score: 0, objectsFound: 0, isMe: true },
    { id: '2', name: 'Sarah_ZA', score: 0, objectsFound: 0, isMe: false },
    { id: '3', name: 'Thabo_M', score: 0, objectsFound: 0, isMe: false },
    { id: '4', name: 'Emma_NL', score: 0, objectsFound: 0, isMe: false }
  ];

  const findMatch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setPlayers(mockPlayers);
      setIsSearching(false);
      setGameStarted(true);
    }, 3000);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Simulate other players scoring
        setPlayers(prev => prev.map(player => ({
          ...player,
          score: player.isMe ? myScore : player.score + Math.random() * 10
        })));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft, myScore]);

  const endGame = () => {
    const finalRank = players.sort((a, b) => b.score - a.score).findIndex(p => p.isMe) + 1;
    onComplete('multiplayer', myScore, 180 - timeLeft, 5, 85);
  };

  if (isSearching) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold mb-2">Finding Players...</h2>
            <p className="text-gray-600">Matching you with players worldwide</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Multiplayer Arena
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">⚔️</div>
            <h2 className="text-2xl font-bold mb-4">Battle Other Players</h2>
            <p className="text-gray-600 mb-6">
              Compete in real-time AR translation battles with players from around the world!
            </p>
            <Button onClick={findMatch} size="lg" className="bg-purple-600 hover:bg-purple-700">
              Find Match
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Live Battle
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onExit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Badge className="bg-white/20">Time: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</Badge>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {players.map((player, index) => (
              <Card key={player.id} className={player.isMe ? 'border-blue-500 border-2' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                      <span className="font-semibold">{player.name}</span>
                    </div>
                    <Badge variant={player.isMe ? 'default' : 'secondary'}>
                      {Math.round(player.score)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplayerArena;