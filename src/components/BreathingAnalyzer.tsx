import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Waves, Play, Pause, TrendingUp, AlertTriangle } from 'lucide-react';

interface BreathingAnalyzerProps {
  pattern: number;
  rhythm: number;
  support: number;
}

interface BreathingMetrics {
  inhaleTime: number;
  exhaleTime: number;
  pauseTime: number;
  depth: number;
  consistency: number;
}

export const BreathingAnalyzer: React.FC<BreathingAnalyzerProps> = ({
  pattern,
  rhythm,
  support
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [breathingData, setBreathingData] = useState<BreathingMetrics[]>([]);
  const [currentBreath, setCurrentBreath] = useState<BreathingMetrics | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale' | 'pause'>('pause');

  useEffect(() => {
    if (isAnalyzing) {
      simulateBreathingAnalysis();
    }
  }, [isAnalyzing]);

  const simulateBreathingAnalysis = () => {
    const interval = setInterval(() => {
      if (!isAnalyzing) {
        clearInterval(interval);
        return;
      }

      // Simulate breathing cycle
      const phases: ('inhale' | 'exhale' | 'pause')[] = ['inhale', 'pause', 'exhale', 'pause'];
      const currentIndex = breathingData.length % phases.length;
      setBreathingPhase(phases[currentIndex]);

      // Generate mock breathing metrics
      const newMetrics: BreathingMetrics = {
        inhaleTime: Math.random() * 2 + 2, // 2-4 seconds
        exhaleTime: Math.random() * 3 + 3, // 3-6 seconds
        pauseTime: Math.random() * 1 + 0.5, // 0.5-1.5 seconds
        depth: Math.random() * 30 + 70, // 70-100%
        consistency: Math.random() * 20 + 75 // 75-95%
      };

      setCurrentBreath(newMetrics);
      setBreathingData(prev => [...prev.slice(-19), newMetrics]); // Keep last 20
    }, 1000);

    return () => clearInterval(interval);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setBreathingData([]);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

  const getBreathingTips = () => {
    const tips: string[] = [];
    
    if (pattern < 75) {
      tips.push('Focus on consistent breathing rhythm');
    }
    if (rhythm < 80) {
      tips.push('Practice 4-4-4 breathing (4 sec in, 4 sec hold, 4 sec out)');
    }
    if (support < 70) {
      tips.push('Strengthen diaphragmatic breathing');
    }
    
    return tips;
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'bg-blue-500';
      case 'exhale': return 'bg-green-500';
      case 'pause': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getOverallScore = () => {
    return Math.round((pattern + rhythm + support) / 3);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Waves className="h-5 w-5" />
          <span>Breathing Pattern Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Breathing Scores */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pattern</span>
                <span>{pattern}%</span>
              </div>
              <Progress value={pattern} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rhythm</span>
                <span>{rhythm}%</span>
              </div>
              <Progress value={rhythm} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Support</span>
                <span>{support}%</span>
              </div>
              <Progress value={support} className="h-2" />
            </div>
          </div>

          {/* Overall Score */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <span className="font-medium">Overall Breathing Score:</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{getOverallScore()}%</span>
              <Badge variant={getOverallScore() >= 80 ? 'default' : getOverallScore() >= 60 ? 'secondary' : 'destructive'}>
                {getOverallScore() >= 80 ? 'Excellent' : getOverallScore() >= 60 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </div>

          {/* Real-time Analysis */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Real-time Breathing Analysis</h4>
              <Button
                variant={isAnalyzing ? "destructive" : "default"}
                size="sm"
                onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              >
                {isAnalyzing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isAnalyzing ? 'Stop' : 'Start'} Analysis
              </Button>
            </div>

            {isAnalyzing && (
              <div className="space-y-4">
                {/* Breathing Phase Indicator */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full ${getPhaseColor(breathingPhase)} flex items-center justify-center text-white font-bold animate-pulse`}>
                      {breathingPhase.toUpperCase()}
                    </div>
                    <p className="text-sm mt-2 capitalize">{breathingPhase} Phase</p>
                  </div>
                </div>

                {/* Current Breath Metrics */}
                {currentBreath && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Inhale Time</div>
                      <div className="text-lg font-semibold">{currentBreath.inhaleTime.toFixed(1)}s</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Exhale Time</div>
                      <div className="text-lg font-semibold">{currentBreath.exhaleTime.toFixed(1)}s</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Breath Depth</div>
                      <div className="text-lg font-semibold">{currentBreath.depth.toFixed(0)}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Consistency</div>
                      <div className="text-lg font-semibold">{currentBreath.consistency.toFixed(0)}%</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Breathing Pattern Visualization */}
          {breathingData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Breathing Pattern History</h4>
              <div className="h-20 bg-gray-50 rounded-lg p-2 overflow-hidden">
                <div className="flex items-end h-full space-x-1">
                  {breathingData.slice(-20).map((breath, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 rounded-t"
                      style={{
                        height: `${breath.depth}%`,
                        width: '4px',
                        opacity: 0.7 + (index / 20) * 0.3
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Breathing Tips */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Improvement Tips</span>
            </h4>
            <div className="space-y-2">
              {getBreathingTips().map((tip, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
              
              {/* General breathing exercises */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-sm mb-2">Recommended Exercises:</h5>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Diaphragmatic breathing: 5 minutes daily</li>
                  <li>• Box breathing: 4-4-4-4 pattern</li>
                  <li>• Lip trills with sustained airflow</li>
                  <li>• Breath support exercises with counting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};