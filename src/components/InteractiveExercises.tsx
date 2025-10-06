import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, X, Volume2, RotateCcw, Trophy } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface Exercise {
  id: string;
  type: 'pronunciation' | 'dragdrop' | 'vocabulary' | 'grammar';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
}

interface DragDropItem {
  id: string;
  text: string;
  category: 'subject' | 'verb' | 'object';
}

const sampleExercises: Exercise[] = [
  {
    id: '1',
    type: 'pronunciation',
    question: 'Pronounce this word correctly: "Sawubona"',
    correctAnswer: 'sawubona',
    explanation: 'This is a common Zulu greeting meaning "hello"',
    audioUrl: '/audio/sawubona.mp3'
  },
  {
    id: '2',
    type: 'vocabulary',
    question: 'What does "ukudla" mean?',
    options: ['water', 'food', 'house', 'person'],
    correctAnswer: 'food',
    explanation: '"Ukudla" is the Zulu word for food',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300'
  },
  {
    id: '3',
    type: 'dragdrop',
    question: 'Arrange these words to form a correct sentence: "I eat food"',
    correctAnswer: ['Ngi', 'ya', 'dla'],
    explanation: 'In Zulu: "Ngi ya dla" means "I eat"'
  },
  {
    id: '4',
    type: 'grammar',
    question: 'Choose the correct verb form: "I __ going to school"',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'am',
    explanation: 'Use "am" with "I" in present continuous tense'
  }
];

const dragDropItems: DragDropItem[] = [
  { id: '1', text: 'Ngi', category: 'subject' },
  { id: '2', text: 'ya', category: 'verb' },
  { id: '3', text: 'dla', category: 'verb' }
];

export const InteractiveExercises: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<DragDropItem[]>(dragDropItems);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const exercise = sampleExercises[currentExercise];

  useEffect(() => {
    resetExercise();
  }, [currentExercise]);

  const resetExercise = () => {
    setSelectedAnswer('');
    setDraggedItems([]);
    setAvailableItems(dragDropItems);
    setIsAnswered(false);
    setIsCorrect(false);
    setRecognizedText('');
  };

  const checkAnswer = () => {
    let correct = false;
    
    switch (exercise.type) {
      case 'vocabulary':
      case 'grammar':
        correct = selectedAnswer === exercise.correctAnswer;
        break;
      case 'dragdrop':
        correct = JSON.stringify(draggedItems) === JSON.stringify(exercise.correctAnswer);
        break;
      case 'pronunciation':
        correct = recognizedText.toLowerCase().includes(exercise.correctAnswer as string);
        break;
    }
    
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < sampleExercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
    } else {
      // Show completion
      alert(`Exercise completed! Score: ${score}/${sampleExercises.length}`);
    }
  };

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'zu-ZA'; // Zulu language
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
    };
    
    recognition.start();
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: DragDropItem) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = availableItems.find(i => i.id === itemId);
    
    if (item) {
      setDraggedItems(prev => [...prev, item.text]);
      setAvailableItems(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFromSentence = (index: number) => {
    const removedText = draggedItems[index];
    const removedItem = dragDropItems.find(item => item.text === removedText);
    
    if (removedItem) {
      setDraggedItems(prev => prev.filter((_, i) => i !== index));
      setAvailableItems(prev => [...prev, removedItem]);
    }
  };

  const renderExercise = () => {
    switch (exercise.type) {
      case 'vocabulary':
      case 'grammar':
        return (
          <div className="space-y-4">
            {exercise.imageUrl && (
              <img src={exercise.imageUrl} alt="Exercise" className="w-48 h-48 object-cover rounded-lg mx-auto" />
            )}
            <div className="grid gap-2">
              {exercise.options?.map((option) => (
                <Button
                  key={option}
                  variant={selectedAnswer === option ? 'default' : 'outline'}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={isAnswered}
                  className="justify-start"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'dragdrop':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="p-3 bg-blue-100 rounded-lg cursor-move hover:bg-blue-200 text-center"
                >
                  {item.text}
                </div>
              ))}
            </div>
            
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="min-h-16 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
            >
              <div className="flex gap-2 flex-wrap">
                {draggedItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => removeFromSentence(index)}
                    className="px-3 py-2 bg-green-100 rounded-lg cursor-pointer hover:bg-green-200"
                  >
                    {item}
                  </div>
                ))}
                {draggedItems.length === 0 && (
                  <p className="text-gray-500">Drag words here to form a sentence</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'pronunciation':
        return (
          <div className="space-y-4 text-center">
            <Button
              variant="outline"
              onClick={() => playAudio(exercise.correctAnswer as string)}
              className="mb-4"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Listen to pronunciation
            </Button>
            
            <Button
              variant={isRecording ? 'destructive' : 'default'}
              onClick={startRecording}
              disabled={isAnswered}
              size="lg"
            >
              {isRecording ? 'Recording...' : 'Start Recording'}
            </Button>
            
            {recognizedText && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">You said:</p>
                <p className="font-medium">{recognizedText}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interactive Exercises</h2>
          <p className="text-gray-600">Practice with adaptive difficulty</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            <Trophy className="h-4 w-4 mr-1" />
            Score: {score}/{sampleExercises.length}
          </Badge>
          <div className="text-sm text-gray-600">
            {currentExercise + 1} of {sampleExercises.length}
          </div>
        </div>
      </div>

      <Progress value={(currentExercise / sampleExercises.length) * 100} className="h-2" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{exercise.question}</CardTitle>
            <Badge variant={exercise.type === 'pronunciation' ? 'default' : 
                          exercise.type === 'dragdrop' ? 'secondary' : 'outline'}>
              {exercise.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderExercise()}

          {isAnswered && (
            <Alert variant={isCorrect ? 'default' : 'destructive'}>
              <div className="flex items-center">
                {isCorrect ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                <AlertDescription className="ml-2">
                  {isCorrect ? 'Correct!' : 'Incorrect.'} {exercise.explanation}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="flex gap-2 justify-between">
            <Button variant="outline" onClick={resetExercise}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <div className="flex gap-2">
              {!isAnswered ? (
                <Button 
                  onClick={checkAnswer}
                  disabled={
                    (exercise.type === 'vocabulary' || exercise.type === 'grammar') && !selectedAnswer ||
                    exercise.type === 'dragdrop' && draggedItems.length === 0 ||
                    exercise.type === 'pronunciation' && !recognizedText
                  }
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextExercise}>
                  {currentExercise < sampleExercises.length - 1 ? 'Next Exercise' : 'Complete'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};