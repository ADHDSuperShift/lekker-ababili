import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Mic, MicOff, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { SpeechRecognitionService, PronunciationScore } from '../lib/speechRecognition';
import { TTSService } from '../lib/tts/TTSService';
import { PronunciationProgress } from './PronunciationProgress';
import { GamificationEngine } from '../lib/gamificationEngine';
interface PronunciationAssessmentProps {
  text: string;
  language: string;
  onScoreUpdate?: (score: PronunciationScore) => void;
}

export const PronunciationAssessment: React.FC<PronunciationAssessmentProps> = ({
  text,
  language,
  onScoreUpdate
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [score, setScore] = useState<PronunciationScore | null>(null);
  const [referenceAudioUrl, setReferenceAudioUrl] = useState<string>('');
  const [progressData, setProgressData] = useState<any[]>([]);
  const [attempts, setAttempts] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechService = useRef(new SpeechRecognitionService());
  const ttsService = useRef(new TTSService());
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    generateReferenceAudio();
    loadProgressData();
  }, [text, language]);

  const generateReferenceAudio = async () => {
    try {
      const audioUrl = await ttsService.current.generateSpeech(text, language);
      setReferenceAudioUrl(audioUrl);
    } catch (error) {
      console.error('Failed to generate reference audio:', error);
    }
  };

  const loadProgressData = () => {
    const stored = localStorage.getItem(`pronunciation_progress_${language}`);
    if (stored) {
      setProgressData(JSON.parse(stored));
    }
  };

  const saveProgressData = (newScore: PronunciationScore) => {
    const newEntry = {
      date: new Date().toLocaleDateString(),
      score: newScore.overall,
      accuracy: newScore.accuracy,
      fluency: newScore.fluency,
      completeness: newScore.completeness,
      prosody: newScore.prosody
    };
    
    const updated = [...progressData, newEntry].slice(-20); // Keep last 20 entries
    setProgressData(updated);
    localStorage.setItem(`pronunciation_progress_${language}`, JSON.stringify(updated));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    try {
      const result = await speechService.current.recognizeSpeech(audioBlob, getLanguageCode(language));
      setUserTranscript(result.transcript);
      
      
      const pronunciationScore = speechService.current.analyzePronunciation(result.transcript, text);
      setScore(pronunciationScore);
      setAttempts(prev => prev + 1);
      
      saveProgressData(pronunciationScore);
      recordGamificationProgress(pronunciationScore.overall);
      onScoreUpdate?.(pronunciationScore);
    } catch (error) {
      console.error('Failed to process recording:', error);
    }
  };

  const getLanguageCode = (lang: string): string => {
    const codes: Record<string, string> = {
      'afrikaans': 'af-ZA',
      'zulu': 'zu-ZA',
      'english': 'en-US',
      'spanish': 'es-ES',
      'french': 'fr-FR',
      'german': 'de-DE'
    };
    return codes[lang.toLowerCase()] || 'en-US';
  };

  const playReference = () => {
    if (audioRef.current && referenceAudioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const reset = () => {
    setUserTranscript('');
    setScore(null);
    setAttempts(0);
  };

  const recordGamificationProgress = (overallScore: number) => {
    const gamificationEngine = GamificationEngine.getInstance();
    const result = gamificationEngine.recordPronunciationSession(overallScore);
    
    if (result.levelUp) {
      alert(`🎉 Level Up! You're now level ${gamificationEngine.getUserStats().level}!`);
    }
    
    if (result.newBadges.length > 0) {
      alert(`🏆 New Badge${result.newBadges.length > 1 ? 's' : ''} Earned: ${result.newBadges.map(b => b.name).join(', ')}!`);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 75) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 60) return { label: 'Fair', variant: 'outline' as const };
    return { label: 'Needs Practice', variant: 'destructive' as const };
  };

  return (
    <div className="space-y-6">
      {/* Reference Text & Audio */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Text</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">{text}</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={playReference}
                disabled={!referenceAudioUrl}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Listen'}
              </Button>
              <audio
                ref={audioRef}
                src={referenceAudioUrl}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Record Your Pronunciation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className="flex items-center space-x-2"
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </Button>
            
            <Button variant="outline" onClick={reset} disabled={!userTranscript}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <div className="text-sm text-gray-600">
              Attempts: {attempts}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {userTranscript && (
        <Card>
          <CardHeader>
            <CardTitle>Your Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="p-4 bg-blue-50 rounded-lg mb-4">{userTranscript}</p>
            
            {score && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Overall Score:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      {score.overall}%
                    </span>
                    <Badge variant={getScoreBadge(score.overall).variant}>
                      {getScoreBadge(score.overall).label}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span>{score.accuracy}%</span>
                    </div>
                    <Progress value={score.accuracy} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fluency</span>
                      <span>{score.fluency}%</span>
                    </div>
                    <Progress value={score.fluency} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completeness</span>
                      <span>{score.completeness}%</span>
                    </div>
                    <Progress value={score.completeness} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Prosody</span>
                      <span>{score.prosody}%</span>
                    </div>
                    <Progress value={score.prosody} className="h-2" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progress Tracking */}
      {progressData.length > 0 && (
        <PronunciationProgress
          progressData={progressData}
          currentScore={score?.overall || 0}
        />
      )}
    </div>
  );
};