import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Camera, CheckCircle, X, Clock, Target, Eye } from 'lucide-react';
import LiveCamera from './LiveCamera';
import AROverlay from './AROverlay';
import { LanguagePair } from './LanguageSelector';

interface ScavengerHuntProps {
  languagePair: LanguagePair;
  onComplete: (gameType: string, score: number, timeElapsed: number, objectsFound: number, accuracy: number) => void;
  onExit: () => void;
}

interface HuntItem {
  id: string;
  name: string;
  translation: string;
  category: string;
  found: boolean;
  foundAt?: string;
}

interface DetectedObject {
  id: string;
  name: string;
  confidence: number;
  boundingBox: { left: number; top: number; width: number; height: number };
  translations: Record<string, string>;
}

const ScavengerHunt: React.FC<ScavengerHuntProps> = ({ languagePair, onComplete, onExit }) => {
  const [huntItems, setHuntItems] = useState<HuntItem[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout>();
  const cameraContainerRef = useRef<HTMLDivElement>(null);

  const huntCategories = {
    kitchen: ['cup', 'plate', 'spoon', 'knife', 'bowl'],
    living: ['chair', 'table', 'lamp', 'book', 'pillow'],
    outdoor: ['tree', 'flower', 'car', 'bicycle', 'bird'],
    food: ['apple', 'banana', 'bread', 'water', 'orange']
  };

  const generateHuntList = useCallback(() => {
    const categories = Object.keys(huntCategories);
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryItems = huntCategories[selectedCategory as keyof typeof huntCategories];
    
    const shuffled = [...categoryItems].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    
    return selected.map((item, index) => ({
      id: `hunt_${index}`,
      name: item,
      translation: `${item}_${languagePair.to}`, // Simplified for demo
      category: selectedCategory,
      found: false
    }));
  }, [languagePair.to]);

  useEffect(() => {
    setHuntItems(generateHuntList());
  }, [generateHuntList]);

  useEffect(() => {
    if (gameStarted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setIsStreaming(true);
    setTimeElapsed(0);
    setScore(0);
    setHint('Look around for the items in your hunt list!');
  };

  const handleFrame = useCallback(async (imageData: string) => {
    if (!gameStarted) return;

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
        checkForHuntItems(result.objects);
      }
    } catch (err) {
      console.error('Object detection error:', err);
    }
  }, [gameStarted, languagePair]);

  const checkForHuntItems = (objects: DetectedObject[]) => {
    setHuntItems(prev => {
      let newScore = score;
      const updated = prev.map(item => {
        if (!item.found) {
          const found = objects.some(obj => 
            obj.name.toLowerCase().includes(item.name.toLowerCase()) && 
            obj.confidence > 0.7
          );
          
          if (found) {
            newScore += 100;
            setScore(newScore);
            setHint(`Great! Found ${item.name}! Keep looking for more items.`);
            return { ...item, found: true, foundAt: new Date().toISOString() };
          }
        }
        return item;
      });
      
      // Check if game is complete
      const allFound = updated.every(item => item.found);
      if (allFound && gameStarted) {
        endGame(newScore, updated.length);
      }
      
      return updated;
    });
  };

  const endGame = (finalScore: number, objectsFound: number) => {
    setGameStarted(false);
    setIsStreaming(false);
    
    const accuracy = (objectsFound / huntItems.length) * 100;
    const timeBonus = Math.max(0, 300 - timeElapsed) * 2; // Bonus for speed
    const totalScore = finalScore + timeBonus;
    
    setTimeout(() => {
      onComplete('scavenger', totalScore, timeElapsed, objectsFound, accuracy);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const foundCount = huntItems.filter(item => item.found).length;
  const progress = (foundCount / huntItems.length) * 100;

  const containerDimensions = cameraContainerRef.current ? {
    width: cameraContainerRef.current.offsetWidth,
    height: cameraContainerRef.current.offsetHeight
  } : { width: 640, height: 480 };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Scavenger Hunt
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onExit} className="text-white border-white hover:bg-white hover:text-green-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(timeElapsed)}
            </Badge>
            <Badge variant="secondary" className="bg-white/20">
              Score: {score}
            </Badge>
            <Badge variant="secondary" className="bg-white/20">
              {foundCount}/{huntItems.length} Found
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!gameStarted ? (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold">Ready for the Hunt?</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Find all the items in your list using your camera. The faster you find them, the more points you earn!
              </p>
              <Button onClick={startGame} size="lg" className="bg-green-600 hover:bg-green-700">
                Start Hunting
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{foundCount}/{huntItems.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Hunt List */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                {huntItems.map(item => (
                  <div key={item.id} className={`p-3 rounded-lg border-2 transition-all ${
                    item.found 
                      ? 'bg-green-50 border-green-300 dark:bg-green-900/20' 
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.found && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.translation}</div>
                  </div>
                ))}
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
              </div>

              {/* Hint */}
              {hint && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">{hint}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScavengerHunt;