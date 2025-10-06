import React, { useState } from 'react';
import { TTSPlayer } from './TTSPlayer';
import { PronunciationAssessment } from './PronunciationAssessment';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const SpeakTab: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');

  const startRecording = () => {
    setIsRecording(true);
    // Mock recording after 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setTranscription('Hallo, hoe gaan dit?');
      setTranslation('Hello, how are you?');
    }, 3000);
  };

  const playTranslation = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const practiceTexts = [
    { text: 'Hallo, hoe gaan dit met jou?', language: 'afrikaans' },
    { text: 'Ek is bly om jou te ontmoet.', language: 'afrikaans' },
    { text: 'Sawubona, unjani?', language: 'zulu' },
    { text: 'Ngiyajabula ukukubona.', language: 'zulu' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Tabs defaultValue="translate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="translate">Voice Translator</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation Practice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="translate">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Voice Translator</CardTitle>
              <p className="text-center text-gray-600">Speak naturally, translate instantly</p>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`w-24 h-24 rounded-full text-white text-3xl font-bold transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse scale-110' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                    }`}
                  >
                    {isRecording ? '⏹️' : '🎤'}
                  </button>
                  {isRecording && (
                    <div className="absolute -inset-2 border-4 border-red-300 rounded-full animate-ping"></div>
                  )}
                </div>
                <p className="mt-4 text-lg font-medium text-gray-700">
                  {isRecording ? 'Listening...' : 'Tap to speak'}
                </p>
              </div>
              
              {transcription && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold text-blue-800 mb-2">You said (Afrikaans):</h3>
                    <p className="text-blue-700 mb-3">{transcription}</p>
                    <TTSPlayer 
                      text={transcription}
                      language="af"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h3 className="font-semibold text-green-800 mb-2">Translation (English):</h3>
                    <p className="text-green-700 mb-3">{translation}</p>
                    <TTSPlayer 
                      text={translation}
                      language="en"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button className="flex-1" variant="default">
                      📖 Save to Wordbook
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={() => {
                      setTranscription('');
                      setTranslation('');
                    }}>
                      🔄 Try Again
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💡 Pro Tip:</h4>
                <p className="text-gray-600 text-sm">
                  Speak clearly and at a normal pace. Our AI supports Afrikaans, Zulu, and 7 international languages with cultural context awareness.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pronunciation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pronunciation Practice</CardTitle>
                <p className="text-gray-600">Practice your pronunciation with AI-powered feedback</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {practiceTexts.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 capitalize">{item.language} Practice</h4>
                      <PronunciationAssessment
                        text={item.text}
                        language={item.language}
                        onScoreUpdate={(score) => {
                          console.log(`Score for "${item.text}":`, score);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { SpeakTab };
export default SpeakTab;