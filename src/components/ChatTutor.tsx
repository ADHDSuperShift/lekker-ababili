import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react';
import FeatureLock from './FeatureLock';
import { useApi } from '../hooks/useApi';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
  audioUrl?: string;
  translation?: string;
  grammarSuggestions?: string[];
  culturalTip?: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context: string;
}

const scenarios: Scenario[] = [
  {
    id: 'restaurant',
    title: 'Ordering Food',
    description: 'Practice ordering at a restaurant',
    difficulty: 'beginner',
    context: 'You are at a traditional restaurant and want to order local dishes.'
  },
  {
    id: 'directions',
    title: 'Asking Directions',
    description: 'Learn to ask for and understand directions',
    difficulty: 'beginner',
    context: 'You are lost in the city and need to find your way to the market.'
  },
  {
    id: 'business',
    title: 'Business Meeting',
    description: 'Professional conversation practice',
    difficulty: 'advanced',
    context: 'You are in a business meeting discussing a new project proposal.'
  },
  {
    id: 'shopping',
    title: 'Shopping',
    description: 'Negotiate prices and make purchases',
    difficulty: 'intermediate',
    context: 'You are at a local market buying fruits and vegetables.'
  }
];

export const ChatTutor: React.FC = () => {
  return (
    <FeatureLock
      feature="hasChatbot"
      requiredPlan="pro"
      featureName="AI Chatbot Tutor"
    >
      <ChatTutorContent />
    </FeatureLock>
  );
};

const ChatTutorContent: React.FC = () => {
  const { request } = useApi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([{
      id: Date.now().toString(),
      text: `Welcome! ${scenario.context} Let's practice together. How can I help you today?`,
      sender: 'tutor',
      timestamp: new Date(),
      culturalTip: scenario.id === 'restaurant' ? 'In many cultures, it\'s polite to greet the server before ordering.' : undefined
    }]);
  };

  const generateTutorResponse = (userMessage: string, scenario: Scenario): Message => {
    const responses = {
      restaurant: [
        "That's a great choice! Would you like to know about the ingredients?",
        "Excellent! The chef recommends pairing that with our local sauce.",
        "Perfect! That dish is very popular here. Anything to drink?"
      ],
      directions: [
        "Sure! Go straight for two blocks, then turn left at the market.",
        "The market is about 10 minutes walk from here. Do you need landmarks?",
        "You're close! It's just past the big blue building on your right."
      ],
      business: [
        "That's an interesting proposal. What timeline are you considering?",
        "I see your point. How would this impact our current resources?",
        "Excellent analysis. What are the next steps you recommend?"
      ],
      shopping: [
        "These mangoes are very fresh today! How many would you like?",
        "That's a fair price. These vegetables are organic and locally grown.",
        "Would you like me to pick the ripest ones for you?"
      ]
    };

    const scenarioResponses = responses[scenario.id as keyof typeof responses] || responses.restaurant;
    const randomResponse = scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];

    return {
      id: Date.now().toString(),
      text: randomResponse,
      sender: 'tutor',
      timestamp: new Date(),
      translation: showTranslations ? `Translation: ${randomResponse}` : undefined,
      grammarSuggestions: Math.random() > 0.7 ? ['Consider using "could" instead of "can" for politeness'] : undefined,
      culturalTip: Math.random() > 0.8 ? 'Cultural tip: Making eye contact shows respect in this context.' : undefined
    };
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedScenario) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      translation: showTranslations ? `Translation: ${inputText}` : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Call real AI API
      const response = await request('/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: messageText,
          conversationId,
          userLevel: selectedScenario.difficulty
        })
      });

      const tutorMessage: Message = {
        id: Date.now().toString(),
        text: response.response,
        sender: 'tutor',
        timestamp: new Date(),
        translation: showTranslations ? `Translation: ${response.response}` : undefined
      };

      setMessages(prev => [...prev, tutorMessage]);
      setConversationId(response.conversationId);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to mock response
      const tutorResponse = generateTutorResponse(messageText, selectedScenario);
      setMessages(prev => [...prev, tutorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        try {
          // Convert to base64 for API
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            
            // Call speech-to-text API
            const response = await request('/speech/transcribe', {
              method: 'POST',
              body: JSON.stringify({
                audioData: base64Audio
              })
            });
            
            setInputText(response.transcription);
          };
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Speech recognition error:', error);
          // Fallback
          setInputText("Hello, I would like to order please");
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">AI Conversation Tutor</h2>
          <p className="text-gray-600">Choose a scenario to start practicing</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => startScenario(scenario)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{scenario.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{scenario.description}</p>
                <p className="text-sm text-gray-500 mt-2">{scenario.context}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{selectedScenario.title}</h2>
          <p className="text-gray-600">{selectedScenario.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTranslations(!showTranslations)}>
            {showTranslations ? 'Hide' : 'Show'} Translations
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedScenario(null)}>
            Change Scenario
          </Button>
        </div>
      </div>

      <Card className="h-96 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <p>{message.text}</p>
                  {message.sender === 'tutor' && (
                    <Button variant="ghost" size="sm" onClick={() => playAudio(message.text)}>
                      🔊
                    </Button>
                  )}
                </div>
                
                {message.translation && showTranslations && (
                  <p className="text-xs opacity-75 mt-1">{message.translation}</p>
                )}
                
                {message.grammarSuggestions && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                    💡 {message.grammarSuggestions[0]}
                  </div>
                )}
                
                {message.culturalTip && (
                  <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                    🌍 {message.culturalTip}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? 'bg-red-100' : ''}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={sendMessage} disabled={!inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};