import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Clock, Zap, X, Target, Trophy } from 'lucide-react';
import LiveCamera from './LiveCamera';
import AROverlay from './AROverlay';
import { LanguagePair } from './LanguageSelector';

interface TimedChallengeProps {
  languagePair: LanguagePair;
  onComplete: (gameType: string, score: number, timeElapsed: number, objectsFound: number, accuracy: number) => void;
  onExit: () => void;
}

interface DetectedObject {
  id: string;
  name: string;
  confidence: number;
  boundingBox: { left: number; top: number; width: number; height: number };
  translations: Record<string, string>;
}

interface ScoredObject {
  name: string;
  translation: string;
  confidence: number;
  timestamp: number;
  points: number;
}

const TimedChallenge: React.FC<TimedChallengeProps> = ({ languagePair, onComplete, onExit }) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [scoredObjects, setScoredObjects] = useState<ScoredObject[]>([]);
  const [combo, setCombo] = useState(0);
  const [lastDetectionTime, setLastDetectionTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const cameraContainerRef = useRef<HTMLDivElement>(null);

  const difficulties = {
    easy: { time: 180, multiplier: 1, name: 'Easy' },
    medium: { time: 120, multiplier: 1.5, name: 'Medium' },
    hard: { time: 60, multiplier: 2, name: 'Hard' }
  };

  const [difficulty, setDifficulty] = useState<keyof typeof difficulties>('medium');

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setIsStreaming(true);
    setTimeLeft(difficulties[difficulty].time);
    setScore(0);
    setScoredObjects([]);
    setCombo(0);
  };

  const handleFrame = useCallback(async (imageData: string) => {
    if (!gameStarted || timeLeft <= 0) return;

    try {
      const response = await fetch('/api/ar/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          sourceLanguage: languagePair.from,
          targetLanguage: languagePair.to
        })
      });

      const result = await response.json();
      if (result.success && result.objects) {
        setDetectedObjects(result.objects);
        processDetections(result.objects);
      }
    } catch (err) {
      console.error('Object detection error:', err);
    }
  }, [gameStarted, timeLeft, languagePair]);

  const processDetections = (objects: DetectedObject[]) => {
    const now = Date.now();
    const newScoredObjects: ScoredObject[] = [];

    objects.forEach(obj => {
      if (obj.confidence > 0.6) {
        // Check if this object type was recently scored to prevent spam
        const recentlyScored = scoredObjects.some(scored => 
          scored.name === obj.name && (now - scored.timestamp) < 3000
        );

        if (!recentlyScored) {
          const basePoints = Math.round(obj.confidence * 50);
          const difficultyMultiplier = difficulties[difficulty].multiplier;
          const comboBonus = Math.min(combo * 5, 50);
          const points = Math.round((basePoints + comboBonus) * difficultyMultiplier);

          const scoredObj: ScoredObject = {
            name: obj.name,
            translation: obj.translations[languagePair.to] || obj.name,
            confidence: obj.confidence,
            timestamp: now,
            points
          };

          newScoredObjects.push(scoredObj);
          
          // Update combo
          if (now - lastDetectionTime < 5000) {
            setCombo(prev => prev + 1);
          } else {
            setCombo(1);
          }
          setLastDetectionTime(now);
        }
      }
    });

    if (newScoredObjects.length > 0) {
      setScoredObjects(prev => [...newScoredObjects, ...prev.slice(0, 9)]);
      const newPoints = newScoredObjects.reduce((sum, obj) => sum + obj.points, 0);
      setScore(prev => prev + newPoints);
    }

    // Combo timeout
    if (now - lastDetectionTime > 5000) {
      setCombo(0);
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setIsStreaming(false);
    
    const objectsFound = scoredObjects.length;
    const avgConfidence = scoredObjects.length > 0 
      ? scoredObjects.reduce((sum, obj) => sum + obj.confidence, 0) / scoredObjects.length 
      : 0;
    const accuracy = avgConfidence * 100;
    const timeElapsed = difficulties[difficulty].time - timeLeft;
    
    setTimeout(() => {
      onComplete('timed', score, timeElapsed, objectsFound, accuracy);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeProgress = (timeLeft / difficulties[difficulty].time) * 100;
  const containerDimensions = cameraContainerRef.current ? {
    width: cameraContainerRef.current.offsetWidth,
    height: cameraContainerRef.current.offsetHeight
  } : { width: 640, height: 480 };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Speed Challenge
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onExit} className="text-white border-white hover:bg-white hover:text-blue-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="secondary" className="bg-white/20">
              Score: {score}
            </Badge>
            {combo > 1 && (
              <Badge variant="secondary" className="bg-yellow-500/80">
                {combo}x Combo!
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!gameStarted ? (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold">Speed Challenge</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Translate as many objects as possible before time runs out! Build combos for bonus points.
              </p>
              
              {/* Difficulty Selection */}
              <div className="flex justify-center gap-2 my-4">
                {Object.entries(difficulties).map(([key, diff]) => (
                  <Button
                    key={key}
                    variant={difficulty === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficulty(key as keyof typeof difficulties)}
                  >
                    {diff.name} ({diff.time}s)
                  </Button>
                ))}
              </div>
              
              <Button onClick={startGame} size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Challenge
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Time Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time Remaining</span>
                  <span className={timeLeft < 30 ? 'text-red-500 font-bold' : ''}>{formatTime(timeLeft)}</span>
                </div>
                <Progress value={timeProgress} className={`h-2 ${timeLeft < 30 ? 'progress-red' : ''}`} />
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                    <div className="text-xs text-gray-600">Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{scoredObjects.length}</div>
                    <div className="text-xs text-gray-600">Objects</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{combo}x</div>
                    <div className="text-xs text-gray-600">Combo</div>
                  </CardContent>
                </Card>
              </div>

              {/* Camera Feed */}
              <div ref={cameraContainerRef} className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
                <LiveCamera
                  onFrame={handleFrame}
                  isStreaming={isStreaming}
                  onStreamToggle={() => setIsStreaming(!isStreaming)}
                />
                
                {isStreaming && detectedObjects.length > 0 && (
                  <AROverlay
                    objects={detectedObjects}
                    onPlayAudio={() => {}}
                    onSaveWord={() => {}}
                    containerWidth={containerDimensions.width}
                    containerHeight={containerDimensions.height}
                    selectedLanguagePair={languagePair}
                  />
                )}
                
                {/* Combo Display */}
                {combo > 1 && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-2 rounded-lg font-bold animate-pulse">
                    {combo}x COMBO!
                  </div>
                )}
              </div>

              {/* Recent Scores */}
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg max-h-32 overflow-y-auto">
                <h4 className="font-semibold mb-2 text-sm">Recent Translations</h4>
                {scoredObjects.slice(0, 5).map((obj, index) => (
                  <div key={index} className="flex justify-between items-center py-1 text-sm">
                    <span>{obj.name} → {obj.translation}</span>
                    <Badge variant="secondary" className="text-xs">+{obj.points}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimedChallenge;