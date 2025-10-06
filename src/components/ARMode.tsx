import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TTSPlayer } from './TTSPlayer';
import LiveCamera from './LiveCamera';
import AROverlay from './AROverlay';
import VoiceCommands from './VoiceCommands';
import LanguageSelector, { LanguagePair } from './LanguageSelector';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera, Volume2, BookOpen, X, Loader2, Zap, Eye, EyeOff } from 'lucide-react';
import { SUPPORTED_LANGUAGE_PAIRS, getDefaultLanguagePair, getLanguageCode } from '../lib/languageConfig';

interface DetectedObject {
  id: string;
  name: string;
  confidence: number;
  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  translations: Record<string, string>;
}

const ARMode: React.FC = () => {
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverlays, setShowOverlays] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [lastPlayedAudio, setLastPlayedAudio] = useState<{ text: string; language: string } | null>(null);
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair>(getDefaultLanguagePair());
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const handleFrame = useCallback(async (imageData: string) => {
    if (!user?.id || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/ar/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          userId: user.id,
          sourceLanguage: selectedLanguagePair.from,
          targetLanguage: selectedLanguagePair.to
        })
      });

      const result = await response.json();
      if (result.success && result.objects) {
        setDetectedObjects(result.objects);
      } else {
        setDetectedObjects([]);
      }
    } catch (err) {
      console.error('AR recognition error:', err);
      setError('Failed to process camera frame');
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, isProcessing, selectedLanguagePair]);

  const handlePlayAudio = useCallback((text: string, language: string) => {
    // Store last played audio for repeat functionality
    setLastPlayedAudio({ text, language });
    
    // Use TTSPlayer with proper language code
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(language);
    speechSynthesis.speak(utterance);
  }, []);

  const handleSaveWord = useCallback(async (object: DetectedObject) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/ar/wordbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          objectName: object.name,
          translations: object.translations
        })
      });

      const result = await response.json();
      if (result.success) {
        // Show success feedback
        alert(`"${object.name}" saved to your wordbook!`);
      }
    } catch (err) {
      console.error('Failed to save word:', err);
    }
  }, [user?.id]);

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming);
    if (isStreaming) {
      setDetectedObjects([]);
      setError(null);
    }
  };

  // Voice command handler
  const handleVoiceCommand = useCallback((command: string) => {
    switch (command) {
      case 'scan':
        if (!isStreaming) {
          toggleStreaming();
        }
        // Trigger immediate frame capture for object detection
        break;
        
      case 'repeat':
        if (lastPlayedAudio) {
          handlePlayAudio(lastPlayedAudio.text, lastPlayedAudio.language);
        }
        break;
        
      case 'save':
        // Save the first detected object if available
        if (detectedObjects.length > 0) {
          handleSaveWord(detectedObjects[0]);
        }
        break;
        
      case 'start':
        if (!isStreaming) {
          toggleStreaming();
        }
        break;
        
      case 'stop':
        if (isStreaming) {
          toggleStreaming();
        }
        break;
        
      case 'toggle':
        setShowOverlays(!showOverlays);
        break;
        
      default:
        console.log('Unknown voice command:', command);
    }
  }, [isStreaming, lastPlayedAudio, detectedObjects, showOverlays, handlePlayAudio, handleSaveWord]);

  const containerDimensions = cameraContainerRef.current ? {
    width: cameraContainerRef.current.offsetWidth,
    height: cameraContainerRef.current.offsetHeight
  } : { width: 640, height: 480 };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            Live AR Object Translator
          </CardTitle>
          <p className="opacity-90">Real-time object detection with live translations</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Language Selector */}
            <LanguageSelector
              selectedPair={selectedLanguagePair}
              onPairChange={setSelectedLanguagePair}
              availablePairs={SUPPORTED_LANGUAGE_PAIRS}
            />

            {/* Camera Feed */}
            <div 
              ref={cameraContainerRef}
              className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden"
            >
              <LiveCamera
                onFrame={handleFrame}
                isStreaming={isStreaming}
                onStreamToggle={toggleStreaming}
              />
              
              {/* AR Overlays */}
              {isStreaming && showOverlays && detectedObjects.length > 0 && (
                <AROverlay
                  objects={detectedObjects}
                  onPlayAudio={handlePlayAudio}
                  onSaveWord={handleSaveWord}
                  containerWidth={containerDimensions.width}
                  containerHeight={containerDimensions.height}
                  selectedLanguagePair={selectedLanguagePair}
                />
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}

              {/* Object Count */}
              {isStreaming && detectedObjects.length > 0 && (
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium">
                    {detectedObjects.length} object{detectedObjects.length !== 1 ? 's' : ''} detected
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={toggleStreaming}
                className={`${
                  isStreaming 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isStreaming ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </>
                )}
              </Button>

              {isStreaming && (
                <Button
                  onClick={() => setShowOverlays(!showOverlays)}
                  variant="outline"
                >
                  {showOverlays ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Labels
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Labels
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Voice Commands */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <VoiceCommands
                onCommand={handleVoiceCommand}
                isListening={isListening}
                onListeningChange={setIsListening}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                How to Use Live AR Mode
              </h4>
               <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                 <li>• Click "Start Camera" to begin live object detection</li>
                 <li>• Point your camera at objects to see real-time translations</li>
                 <li>• Use voice commands: "What is this?", "Repeat", "Save word"</li>
                 <li>• Tap the speaker icon to hear pronunciations</li>
                 <li>• Save interesting words to your personal Wordbook</li>
                 <li>• Works best with good lighting and clear object visibility</li>
               </ul>
            </div>

            {/* Supported Objects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl mb-2">🪑</div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Furniture</h3>
                <p className="text-sm text-blue-600 dark:text-blue-300">Chairs, tables, sofas</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl mb-2">🍎</div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Food</h3>
                <p className="text-sm text-green-600 dark:text-green-300">Fruits, vegetables, dishes</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl mb-2">🐕</div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">Animals</h3>
                <p className="text-sm text-orange-600 dark:text-orange-300">Pets, wildlife, birds</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARMode;