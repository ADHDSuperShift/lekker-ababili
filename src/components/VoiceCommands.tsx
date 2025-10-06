import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from './ui/button';

interface VoiceCommandsProps {
  onCommand: (command: string) => void;
  isListening?: boolean;
  onListeningChange?: (listening: boolean) => void;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({
  onCommand,
  isListening = false,
  onListeningChange
}) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');

  // Voice command patterns
  const commandPatterns = {
    scan: ['what is this', 'scan object', 'detect object', 'identify this'],
    repeat: ['repeat', 'say again', 'play again', 'repeat audio'],
    save: ['save word', 'add to wordbook', 'save this', 'remember this'],
    start: ['start camera', 'begin scanning', 'activate camera'],
    stop: ['stop camera', 'stop scanning', 'deactivate camera'],
    toggle: ['toggle overlays', 'show labels', 'hide labels']
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.toLowerCase().trim();
          setLastCommand(transcript);
          processCommand(transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (onListeningChange) onListeningChange(false);
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          // Restart recognition if it should be listening
          recognitionInstance.start();
        } else if (onListeningChange) {
          onListeningChange(false);
        }
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, [isListening, onListeningChange]);

  const processCommand = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Check each command pattern
    for (const [command, patterns] of Object.entries(commandPatterns)) {
      for (const pattern of patterns) {
        if (lowerTranscript.includes(pattern)) {
          onCommand(command);
          return;
        }
      }
    }
    
    // If no pattern matches, send the raw transcript
    onCommand(transcript);
  }, [onCommand]);

  const toggleListening = useCallback(() => {
    if (!recognition || !isSupported) return;

    if (isListening) {
      recognition.stop();
      if (onListeningChange) onListeningChange(false);
    } else {
      recognition.start();
      if (onListeningChange) onListeningChange(true);
    }
  }, [recognition, isListening, onListeningChange, isSupported]);

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500 p-2 bg-gray-100 rounded-lg">
        Voice commands not supported in this browser
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          onClick={toggleListening}
          className={`${
            isListening 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          size="sm"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Voice Commands
            </>
          )}
        </Button>
        
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Volume2 className="h-4 w-4" />
            Listening for commands...
          </div>
        )}
      </div>

      {lastCommand && (
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
          Last heard: "{lastCommand}"
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Voice Commands:</strong></p>
        <ul className="space-y-0.5 ml-2">
          <li>• "What is this?" - Scan object</li>
          <li>• "Repeat" - Replay audio</li>
          <li>• "Save word" - Add to wordbook</li>
          <li>• "Start camera" - Begin scanning</li>
          <li>• "Stop camera" - End scanning</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceCommands;