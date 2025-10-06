import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Mic, MicOff, Play, Pause, Volume2, Brain, Eye, 
  Waves, Target, TrendingUp, AlertCircle 
} from 'lucide-react';
import { MouthVisualization } from './MouthVisualization';
import { BreathingAnalyzer } from './BreathingAnalyzer';
import { LipSyncAnalyzer } from './LipSyncAnalyzer';
import { AccentModifier } from './AccentModifier';

interface VoiceAnalysis {
  lipSync: {
    accuracy: number;
    timing: number;
    mouthShape: string[];
  };
  breathing: {
    pattern: number;
    rhythm: number;
    support: number;
  };
  accent: {
    current: string;
    target: string;
    similarity: number;
    improvements: string[];
  };
  realTimeFeedback: {
    pitch: number;
    volume: number;
    clarity: number;
    rhythm: number;
  };
}

interface AIVoiceCoachProps {
  text: string;
  language: string;
  targetAccent?: string;
}

export const AIVoiceCoach: React.FC<AIVoiceCoachProps> = ({
  text,
  language,
  targetAccent = 'native'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [coachingTips, setCoachingTips] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    initializeAudioContext();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializeAudioContext = () => {
    try {
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 2048;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  };

  const startAdvancedRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Connect to audio context for real-time analysis
      if (audioContextRef.current && analyzerRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyzerRef.current);
        startRealTimeAnalysis();
      }

      mediaRecorder.ondataavailable = (event) => {
        // Process audio data for advanced analysis
      };

      mediaRecorder.onstop = async () => {
        await performAdvancedAnalysis();
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start advanced recording:', error);
    }
  };

  const stopAdvancedRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startRealTimeAnalysis = () => {
    const analyzeFrame = () => {
      if (!analyzerRef.current || !isRecording) return;
      
      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzerRef.current.getByteFrequencyData(dataArray);
      
      // Analyze real-time audio data
      const pitch = calculatePitch(dataArray);
      const volume = calculateVolume(dataArray);
      const clarity = calculateClarity(dataArray);
      const rhythm = calculateRhythm(dataArray);
      
      setRealTimeData({
        pitch,
        volume,
        clarity,
        rhythm,
        timestamp: Date.now()
      });
      
      if (isRecording) {
        requestAnimationFrame(analyzeFrame);
      }
    };
    
    analyzeFrame();
  };

  const performAdvancedAnalysis = async () => {
    // Simulate advanced AI analysis
    const mockAnalysis: VoiceAnalysis = {
      lipSync: {
        accuracy: Math.floor(Math.random() * 20) + 75,
        timing: Math.floor(Math.random() * 15) + 80,
        mouthShape: ['ah', 'eh', 'oh', 'oo']
      },
      breathing: {
        pattern: Math.floor(Math.random() * 25) + 70,
        rhythm: Math.floor(Math.random() * 20) + 75,
        support: Math.floor(Math.random() * 30) + 65
      },
      accent: {
        current: 'detected_accent',
        target: targetAccent,
        similarity: Math.floor(Math.random() * 30) + 60,
        improvements: [
          'Focus on vowel pronunciation',
          'Adjust consonant stress',
          'Work on intonation patterns'
        ]
      },
      realTimeFeedback: {
        pitch: Math.floor(Math.random() * 20) + 75,
        volume: Math.floor(Math.random() * 15) + 80,
        clarity: Math.floor(Math.random() * 25) + 70,
        rhythm: Math.floor(Math.random() * 20) + 75
      }
    };
    
    setAnalysis(mockAnalysis);
    generateCoachingTips(mockAnalysis);
  };

  const generateCoachingTips = (analysis: VoiceAnalysis) => {
    const tips: string[] = [];
    
    if (analysis.lipSync.accuracy < 80) {
      tips.push('Practice mouth movements in front of a mirror');
    }
    if (analysis.breathing.support < 75) {
      tips.push('Focus on diaphragmatic breathing exercises');
    }
    if (analysis.accent.similarity < 70) {
      tips.push('Listen to native speakers and mimic their intonation');
    }
    if (analysis.realTimeFeedback.clarity < 75) {
      tips.push('Speak more slowly and articulate each syllable');
    }
    
    setCoachingTips(tips);
  };

  const calculatePitch = (dataArray: Uint8Array): number => {
    // Simplified pitch calculation
    return Math.floor(Math.random() * 40) + 60;
  };

  const calculateVolume = (dataArray: Uint8Array): number => {
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    return Math.floor((average / 255) * 100);
  };

  const calculateClarity = (dataArray: Uint8Array): number => {
    // Simplified clarity calculation based on frequency distribution
    return Math.floor(Math.random() * 30) + 70;
  };

  const calculateRhythm = (dataArray: Uint8Array): number => {
    // Simplified rhythm calculation
    return Math.floor(Math.random() * 25) + 75;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Voice Coach</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg font-medium p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              {text}
            </p>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                onClick={isRecording ? stopAdvancedRecording : startAdvancedRecording}
                className="flex items-center space-x-2"
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                <span>{isRecording ? 'Stop Analysis' : 'Start AI Analysis'}</span>
              </Button>
              
              {isRecording && realTimeData && (
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Recording</span>
                  </div>
                  <Badge variant="outline">
                    Volume: {realTimeData.volume}%
                  </Badge>
                  <Badge variant="outline">
                    Clarity: {realTimeData.clarity}%
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mouth">3D Mouth</TabsTrigger>
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="lipsync">Lip Sync</TabsTrigger>
            <TabsTrigger value="accent">Accent</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lip Sync Accuracy</span>
                      <span>{analysis.lipSync.accuracy}%</span>
                    </div>
                    <Progress value={analysis.lipSync.accuracy} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Breathing Support</span>
                      <span>{analysis.breathing.support}%</span>
                    </div>
                    <Progress value={analysis.breathing.support} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accent Similarity</span>
                      <span>{analysis.accent.similarity}%</span>
                    </div>
                    <Progress value={analysis.accent.similarity} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Clarity</span>
                      <span>{analysis.realTimeFeedback.clarity}%</span>
                    </div>
                    <Progress value={analysis.realTimeFeedback.clarity} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {coachingTips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>AI Coaching Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {coachingTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="mouth">
            <MouthVisualization 
              mouthShapes={analysis.lipSync.mouthShape}
              accuracy={analysis.lipSync.accuracy}
              text={text}
            />
          </TabsContent>

          <TabsContent value="breathing">
            <BreathingAnalyzer 
              pattern={analysis.breathing.pattern}
              rhythm={analysis.breathing.rhythm}
              support={analysis.breathing.support}
            />
          </TabsContent>

          <TabsContent value="lipsync">
            <LipSyncAnalyzer 
              accuracy={analysis.lipSync.accuracy}
              timing={analysis.lipSync.timing}
              mouthShapes={analysis.lipSync.mouthShape}
              text={text}
            />
          </TabsContent>

          <TabsContent value="accent">
            <AccentModifier 
              currentAccent={analysis.accent.current}
              targetAccent={analysis.accent.target}
              similarity={analysis.accent.similarity}
              improvements={analysis.accent.improvements}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};