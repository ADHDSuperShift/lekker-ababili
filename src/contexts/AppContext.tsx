import React, { createContext, useContext, useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  progress: number;
}

interface Exercise {
  id: string;
  type: 'multiple-choice' | 'translation' | 'listening' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string;
  completed: boolean;
}

interface AppContextType {
  lessons: Lesson[];
  exercises: Exercise[];
  currentLesson: Lesson | null;
  setCurrentLesson: (lesson: Lesson | null) => void;
  updateLessonProgress: (lessonId: string, progress: number) => void;
  completeExercise: (exerciseId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  
  const [lessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Basic Greetings',
      description: 'Learn essential greetings in your target language',
      difficulty: 'beginner',
      completed: false,
      progress: 0
    },
    {
      id: '2',
      title: 'Numbers 1-20',
      description: 'Master counting from 1 to 20',
      difficulty: 'beginner',
      completed: false,
      progress: 0
    },
    {
      id: '3',
      title: 'Family Members',
      description: 'Learn vocabulary for family relationships',
      difficulty: 'intermediate',
      completed: false,
      progress: 0
    }
  ]);

  const [exercises] = useState<Exercise[]>([
    {
      id: '1',
      type: 'multiple-choice',
      question: 'How do you say "Hello" in Spanish?',
      options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
      correctAnswer: 'Hola',
      completed: false
    },
    {
      id: '2',
      type: 'translation',
      question: 'Translate: "Good morning"',
      correctAnswer: 'Buenos días',
      completed: false
    }
  ]);

  const updateLessonProgress = (lessonId: string, progress: number) => {
    // Implementation would update lesson progress
    console.log(`Updating lesson ${lessonId} progress to ${progress}%`);
  };

  const completeExercise = (exerciseId: string) => {
    // Implementation would mark exercise as completed
    console.log(`Exercise ${exerciseId} completed`);
  };

  return (
    <AppContext.Provider
      value={{
        lessons,
        exercises,
        currentLesson,
        setCurrentLesson,
        updateLessonProgress,
        completeExercise,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};