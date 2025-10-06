import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

const ExercisesScreen = () => {
  const { exercises } = useApp();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const exercise = exercises[currentExercise];

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    if (!selectedAnswer) {
      Alert.alert('Please select an answer');
      return;
    }

    setShowResult(true);
    
    if (selectedAnswer === exercise.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      Alert.alert(
        'Exercise Complete!',
        `You scored ${score + (selectedAnswer === exercise.correctAnswer ? 1 : 0)} out of ${exercises.length}`,
        [{ text: 'Restart', onPress: resetExercises }]
      );
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'list-outline';
      case 'translation':
        return 'language-outline';
      case 'listening':
        return 'headset-outline';
      case 'speaking':
        return 'mic-outline';
      default:
        return 'help-outline';
    }
  };

  if (!exercise) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="school-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Exercises Available</Text>
          <Text style={styles.emptySubtitle}>Complete some lessons to unlock exercises</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercises</Text>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {currentExercise + 1} of {exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentExercise + 1) / exercises.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseType}>
              <Ionicons 
                name={getExerciseIcon(exercise.type) as keyof typeof Ionicons.glyphMap}
                size={20} 
                color="#3B82F6" 
              />
              <Text style={styles.exerciseTypeText}>
                {exercise.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>
            <Text style={styles.scoreText}>Score: {score}/{exercises.length}</Text>
          </View>

          <Text style={styles.question}>{exercise.question}</Text>

          {exercise.type === 'multiple-choice' && exercise.options && (
            <View style={styles.optionsContainer}>
              {exercise.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    showResult && option === exercise.correctAnswer && styles.correctOption,
                    showResult && selectedAnswer === option && option !== exercise.correctAnswer && styles.incorrectOption,
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedAnswer === option && styles.selectedOptionText,
                      showResult && option === exercise.correctAnswer && styles.correctOptionText,
                      showResult && selectedAnswer === option && option !== exercise.correctAnswer && styles.incorrectOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                  {showResult && option === exercise.correctAnswer && (
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  )}
                  {showResult && selectedAnswer === option && option !== exercise.correctAnswer && (
                    <Ionicons name="close-circle" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {showResult && (
            <View style={styles.resultContainer}>
              <Text style={[
                styles.resultText,
                selectedAnswer === exercise.correctAnswer ? styles.correctResult : styles.incorrectResult
              ]}>
                {selectedAnswer === exercise.correctAnswer ? 'Correct!' : 'Incorrect'}
              </Text>
              {selectedAnswer !== exercise.correctAnswer && (
                <Text style={styles.correctAnswerText}>
                  Correct answer: {exercise.correctAnswer}
                </Text>
              )}
            </View>
          )}

          <View style={styles.buttonContainer}>
            {!showResult ? (
              <TouchableOpacity
                style={[styles.submitButton, !selectedAnswer && styles.disabledButton]}
                onPress={submitAnswer}
                disabled={!selectedAnswer}
              >
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={nextExercise}
              >
                <Text style={styles.nextButtonText}>
                  {currentExercise < exercises.length - 1 ? 'Next Exercise' : 'Finish'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressInfo: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  exerciseType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseTypeText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  scoreText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  incorrectOption: {
    borderColor: '#EF4444',
    backgroundColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  correctOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  incorrectOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  resultContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  correctResult: {
    color: '#10B981',
  },
  incorrectResult: {
    color: '#EF4444',
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ExercisesScreen;