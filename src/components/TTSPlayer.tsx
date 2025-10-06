import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Play, Pause, Volume2, Download, Settings } from 'lucide-react';
import { TTSService, TTSRequest } from '../lib/tts/TTSService';

interface TTSPlayerProps {
  text: string;
  language: string;
  className?: string;
}

export function TTSPlayer({ text, language, className }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voices, setVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [speed, setSpeed] = useState([1.0]);
  const [pitch, setPitch] = useState([1.0]);
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState<string>('');
  const [cached, setCached] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const ttsService = useRef(new TTSService());

  useEffect(() => {
    loadVoices();
  }, [language]);

  const loadVoices = async () => {
    try {
      const availableVoices = await ttsService.current.getVoices(language);
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const handlePlay = async () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Generate new audio
    setIsLoading(true);
    try {
      const request: TTSRequest = {
        text,
        language,
        voice: selectedVoice,
        speed: speed[0],
        pitch: pitch[0]
      };

      const response = await ttsService.current.synthesize(request);
      setAudioUrl(response.audioUrl);
      setProvider(response.provider);
      setCached(response.cached);

      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = response.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('TTS synthesis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `tts-${language}-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <Button
          onClick={handlePlay}
          disabled={isLoading || !text.trim()}
          size="sm"
          className="flex-shrink-0"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">{text}</p>
          {provider && (
            <p className="text-xs text-gray-400">
              {provider} {cached && '(cached)'}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-4 h-4" />
        </Button>

        {audioUrl && (
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showSettings && (
        <div className="space-y-4 pt-3 border-t">
          <div>
            <label className="text-sm font-medium mb-2 block">Voice</label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice} value={voice}>
                    {voice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Speed: {speed[0].toFixed(1)}x
            </label>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Pitch: {pitch[0].toFixed(1)}
            </label>
            <Slider
              value={pitch}
              onValueChange={setPitch}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
    </Card>
  );
}