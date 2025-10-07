import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from '../lib/supabase';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Volume2 } from 'lucide-react';

interface LessonViewerProps {
  lessonId: string;
  onComplete?: () => void;
  onExit?: () => void;
}

export default function LessonViewer({ lessonId, onComplete, onExit }: LessonViewerProps) {
  const [lesson, setLesson] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    setLoading(true);
    try {
      const lessonData = await supabaseHelpers.getLesson(lessonId);
      setLesson(lessonData);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (lesson && currentSection < lesson.content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setShowFeedback(false);
    } else {
      completeLesson();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setShowFeedback(false);
    }
  };

  const handleAnswer = (exerciseIndex: number, answer: any) => {
    setAnswers({ ...answers, [exerciseIndex]: answer });
  };

  const checkAnswers = () => {
    const section = lesson.content.sections[currentSection];
    if (section.type === 'practice') {
      let correct = 0;
      section.exercises.forEach((exercise: any, index: number) => {
        const userAnswer = answers[index];
        if (exercise.type === 'multiple_choice' && userAnswer === exercise.correct) {
          correct++;
        } else if (exercise.type === 'fill_blank' && userAnswer?.toLowerCase() === exercise.answer.toLowerCase()) {
          correct++;
        }
      });
      setScore(Math.round((correct / section.exercises.length) * 100));
      setShowFeedback(true);
    }
  };

  const completeLesson = async () => {
    if (onComplete) {
      onComplete();
    }
    // Here you would save completion to Supabase
  };

  const renderSection = () => {
    if (!lesson) return null;

    const section = lesson.content.sections[currentSection];

    switch (section.type) {
      case 'introduction':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{section.title_af}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{section.content_af}</p>
            </CardContent>
          </Card>
        );

      case 'vocabulary':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{section.title_af}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.words.map((word: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xl font-bold text-blue-600">
                          {word.english || word.spanish || word.french}
                        </h4>
                        <p className="text-gray-600">{word.afrikaans}</p>
                        <p className="text-sm text-gray-500 italic">/{word.pronunciation}/</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <p className="text-sm font-medium">
                        {word.example_en || word.example_es || word.example_fr}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{word.example_af}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'dialogue':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{section.title_af}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.conversation.map((line: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-blue-50' : 'bg-purple-50'}`}>
                    <p className="font-semibold text-sm text-gray-600 mb-1">{line.speaker}</p>
                    <p className="text-lg font-medium">{line.english}</p>
                    <p className="text-gray-600 mt-1">{line.afrikaans}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'practice':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{section.title_af}</CardTitle>
              <CardDescription>Voltooi die oefeninge om voort te gaan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {section.exercises.map((exercise: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium mb-4">{exercise.question_af}</p>

                    {exercise.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        {exercise.options.map((option: string, optionIndex: number) => (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswer(index, optionIndex)}
                            disabled={showFeedback}
                            className={`w-full p-3 text-left border rounded-lg transition ${
                              answers[index] === optionIndex
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-300'
                            } ${
                              showFeedback && optionIndex === exercise.correct
                                ? 'border-green-500 bg-green-50'
                                : ''
                            } ${
                              showFeedback && answers[index] === optionIndex && optionIndex !== exercise.correct
                                ? 'border-red-500 bg-red-50'
                                : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showFeedback && optionIndex === exercise.correct && (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              )}
                              {showFeedback && answers[index] === optionIndex && optionIndex !== exercise.correct && (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {exercise.type === 'fill_blank' && (
                      <input
                        type="text"
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswer(index, e.target.value)}
                        disabled={showFeedback}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Tik jou antwoord hier..."
                      />
                    )}

                    {showFeedback && exercise.explanation_af && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">{exercise.explanation_af}</p>
                      </div>
                    )}
                  </div>
                ))}

                {!showFeedback && (
                  <Button onClick={checkAnswers} className="w-full">
                    Kontroleer Antwoorde
                  </Button>
                )}

                {showFeedback && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Jou Telling: {score}%</h3>
                    <p className="text-gray-700">
                      {score >= 80 ? '🎉 Uitstekend! Jy het baie goed gedoen!' : 
                       score >= 60 ? '👍 Goed gedaan! Oefen nog n bietjie.' :
                       '💪 Probeer weer! Oefening maak perfek.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'summary':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{section.title_af}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <p className="text-lg">{section.content_af}</p>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Jy het geleer:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {section.learned.map((word: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return <div>Unknown section type</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Laai les...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p>Les nie gevind nie.</p>
            <Button onClick={onExit} className="mt-4">
              Terug
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentSection + 1) / lesson.content.sections.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">{lesson.title_af}</h1>
              <p className="text-gray-600">{lesson.description_af}</p>
            </div>
            <Button variant="ghost" onClick={onExit}>
              Sluit
            </Button>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Vordering</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">{renderSection()}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vorige
          </Button>

          <Button onClick={handleNext}>
            {currentSection === lesson.content.sections.length - 1 ? 'Voltooi' : 'Volgende'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
