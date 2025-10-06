import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, Play, Pause, Target, Clock, Zap } from 'lucide-react';

interface LipSyncAnalyzerProps {
  accuracy: number;
  timing: number;
  mouthShapes: string[];
  text: string;
}

interface LipSyncFrame {
  timestamp: number;
  expectedShape: string;
  detectedShape: string;
  accuracy: number;
  timing: number;
}

export const LipSyncAnalyzer: React.FC<LipSyncAnalyzerProps> = ({
  accuracy,
  timing,
  mouthShapes,
  text
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [lipSyncData, setLipSyncData] = useState<LipSyncFrame[]>([]);
  const [realTimeAccuracy, setRealTimeAccuracy] = useState(0);

  useEffect(() => {
    if (isAnalyzing) {
      simulateLipSyncAnalysis();
    }
  }, [isAnalyzing]);

  const simulateLipSyncAnalysis = () => {
    let frameIndex = 0;
    const interval = setInterval(() => {
      if (!isAnalyzing || frameIndex >= mouthShapes.length) {
        clearInterval(interval);
        setIsAnalyzing(false);
        return;
      }

      const frame: LipSyncFrame = {
        timestamp: Date.now(),
        expectedShape: mouthShapes[frameIndex],
        detectedShape: getRandomShape(),
        accuracy: Math.random() * 30 + 70, // 70-100%
        timing: Math.random() * 20 + 80 // 80-100%
      };

      setCurrentFrame(frameIndex);
      setLipSyncData(prev => [...prev, frame]);
      setRealTimeAccuracy(frame.accuracy);
      
      frameIndex++;
    }, 800);

    return () => clearInterval(interval);
  };

  const getRandomShape = () => {
    const shapes = ['ah', 'eh', 'oh', 'oo', 'neutral'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setLipSyncData([]);
    setCurrentFrame(0);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

  const getShapeMatchColor = (expected: string, detected: string) => {
    return expected === detected ? 'text-green-600' : 'text-red-600';
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return 'text-green-600';
    if (acc >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateOverallAccuracy = () => {
    if (lipSyncData.length === 0) return 0;
    return lipSyncData.reduce((sum, frame) => sum + frame.accuracy, 0) / lipSyncData.length;
  };

  const calculateTimingAccuracy = () => {
    if (lipSyncData.length === 0) return 0;
    return lipSyncData.reduce((sum, frame) => sum + frame.timing, 0) / lipSyncData.length;
  };

  const getLipSyncTips = () => {
    const tips: string[] = [];
    
    if (accuracy < 80) {
      tips.push('Practice mouth movements slowly in front of a mirror');
      tips.push('Focus on exaggerated mouth positions for each sound');
    }
    
    if (timing < 85) {
      tips.push('Work on synchronizing mouth movements with audio');
      tips.push('Practice with slower speech first, then increase speed');
    }
    
    const overallAcc = calculateOverallAccuracy();
    if (overallAcc < 75) {
      tips.push('Record yourself speaking and compare with native speakers');
    }
    
    return tips;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Lip Sync Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>Accuracy</span>
                </span>
                <span>{accuracy}%</span>
              </div>
              <Progress value={accuracy} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Timing</span>
                </span>
                <span>{timing}%</span>
              </div>
              <Progress value={timing} className="h-2" />
            </div>
          </div>

          {/* Real-time Analysis Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Real-time Lip Sync Analysis</h4>
              <Button
                variant={isAnalyzing ? "destructive" : "default"}
                size="sm"
                onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              >
                {isAnalyzing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isAnalyzing ? 'Stop' : 'Start'} Analysis
              </Button>
            </div>

            {/* Current Analysis Display */}
            {isAnalyzing && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Analyzing Frame {currentFrame + 1} of {mouthShapes.length}</span>
                  <Badge variant="outline" className="animate-pulse">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Expected</div>
                    <div className="font-semibold text-blue-600">
                      {mouthShapes[currentFrame] || 'neutral'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Detected</div>
                    <div className={`font-semibold ${getShapeMatchColor(
                      mouthShapes[currentFrame], 
                      lipSyncData[lipSyncData.length - 1]?.detectedShape || 'neutral'
                    )}`}>
                      {lipSyncData[lipSyncData.length - 1]?.detectedShape || 'neutral'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Accuracy</div>
                    <div className={`font-semibold ${getAccuracyColor(realTimeAccuracy)}`}>
                      {realTimeAccuracy.toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                <Progress value={realTimeAccuracy} className="h-2 mt-3" />
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {lipSyncData.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Analysis Results</h4>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Overall Accuracy</div>
                  <div className="text-lg font-semibold">
                    {calculateOverallAccuracy().toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Timing Accuracy</div>
                  <div className="text-lg font-semibold">
                    {calculateTimingAccuracy().toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Frame-by-frame Results */}
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Frame Analysis</h5>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {lipSyncData.map((frame, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-4">
                        <span className="w-8 text-gray-500">#{index + 1}</span>
                        <span>Expected: <strong>{frame.expectedShape}</strong></span>
                        <span>Detected: <strong className={getShapeMatchColor(frame.expectedShape, frame.detectedShape)}>
                          {frame.detectedShape}
                        </strong></span>
                      </div>
                      <Badge variant={frame.accuracy >= 80 ? 'default' : frame.accuracy >= 60 ? 'secondary' : 'destructive'}>
                        {frame.accuracy.toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Text Breakdown */}
          <div className="space-y-2">
            <h4 className="font-medium">Text & Phoneme Mapping</h4>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm font-mono mb-2">{text}</div>
              <div className="flex flex-wrap gap-1">
                {mouthShapes.map((shape, index) => (
                  <Badge
                    key={index}
                    variant={index === currentFrame && isAnalyzing ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {shape}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="space-y-2">
            <h4 className="font-medium">Improvement Tips</h4>
            <div className="space-y-2">
              {getLipSyncTips().map((tip, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                  <Target className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};