export interface UserPerformanceData {
  userId: string;
  language: string;
  scores: PronunciationScore[];
  weakAreas: WeakArea[];
  learningPace: number;
  totalPracticeTime: number;
  lastActivity: Date;
  difficultyLevel: number;
}

export interface PronunciationScore {
  overall: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
  timestamp: Date;
  text: string;
  attempts: number;
}

export interface WeakArea {
  category: 'accuracy' | 'fluency' | 'completeness' | 'prosody';
  score: number;
  frequency: number;
  lastImprovement: Date | null;
  specificSounds?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LearningRecommendation {
  type: 'practice' | 'lesson' | 'review' | 'challenge';
  title: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  targetAreas: string[];
  content: string;
  priority: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  lessons: LearningPathLesson[];
  estimatedDuration: number;
  targetLevel: string;
  adaptiveFeatures: string[];
}

export interface LearningPathLesson {
  id: string;
  title: string;
  content: string;
  difficulty: number;
  targetSkills: string[];
  prerequisites: string[];
  estimatedTime: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  score?: number;
}

export class AdaptiveLearningEngine {
  private readonly DIFFICULTY_THRESHOLD = 0.75;
  private readonly IMPROVEMENT_THRESHOLD = 10;
  private readonly MIN_SESSIONS_FOR_ANALYSIS = 5;

  analyzePerformance(performanceData: UserPerformanceData): {
    weakAreas: WeakArea[];
    strengths: string[];
    overallProgress: number;
    recommendations: LearningRecommendation[];
  } {
    const recentScores = performanceData.scores.slice(-10);
    const weakAreas = this.identifyWeakAreas(recentScores);
    const strengths = this.identifyStrengths(recentScores);
    const overallProgress = this.calculateOverallProgress(performanceData.scores);
    const recommendations = this.generateRecommendations(weakAreas, performanceData);

    return { weakAreas, strengths, overallProgress, recommendations };
  }

  private identifyWeakAreas(scores: PronunciationScore[]): WeakArea[] {
    if (scores.length < this.MIN_SESSIONS_FOR_ANALYSIS) return [];

    const categories = ['accuracy', 'fluency', 'completeness', 'prosody'] as const;
    const weakAreas: WeakArea[] = [];

    categories.forEach(category => {
      const categoryScores = scores.map(s => s[category]);
      const averageScore = categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length;
      
      if (averageScore < 70) {
        const frequency = categoryScores.filter(score => score < 70).length;
        const lastImprovement = this.findLastImprovement(categoryScores);
        
        weakAreas.push({
          category,
          score: averageScore,
          frequency,
          lastImprovement,
          difficulty: this.getDifficultyLevel(averageScore),
          specificSounds: this.analyzeSpecificSounds(scores, category)
        });
      }
    });

    return weakAreas.sort((a, b) => a.score - b.score);
  }

  private identifyStrengths(scores: PronunciationScore[]): string[] {
    if (scores.length < this.MIN_SESSIONS_FOR_ANALYSIS) return [];

    const categories = ['accuracy', 'fluency', 'completeness', 'prosody'] as const;
    const strengths: string[] = [];

    categories.forEach(category => {
      const categoryScores = scores.map(s => s[category]);
      const averageScore = categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length;
      
      if (averageScore >= 85) {
        strengths.push(category);
      }
    });

    return strengths;
  }

  private calculateOverallProgress(scores: PronunciationScore[]): number {
    if (scores.length < 2) return 0;

    const recentAvg = scores.slice(-5).reduce((sum, s) => sum + s.overall, 0) / Math.min(5, scores.length);
    const earlierAvg = scores.slice(0, 5).reduce((sum, s) => sum + s.overall, 0) / Math.min(5, scores.length);
    
    return Math.round(((recentAvg - earlierAvg) / earlierAvg) * 100);
  }

  private generateRecommendations(weakAreas: WeakArea[], userData: UserPerformanceData): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = [];

    // Generate recommendations based on weak areas
    weakAreas.forEach((area, index) => {
      recommendations.push({
        type: 'practice',
        title: `Improve ${area.category}`,
        description: `Focus on ${area.category} with targeted exercises`,
        difficulty: this.getDifficultyNumber(area.difficulty),
        estimatedTime: 15,
        targetAreas: [area.category],
        content: this.generatePracticeContent(area, userData.language),
        priority: weakAreas.length - index
      });
    });

    // Add challenge recommendations for advanced users
    if (userData.difficultyLevel >= 3) {
      recommendations.push({
        type: 'challenge',
        title: 'Advanced Pronunciation Challenge',
        description: 'Test your skills with complex sentences and tongue twisters',
        difficulty: 4,
        estimatedTime: 20,
        targetAreas: ['accuracy', 'fluency'],
        content: this.getAdvancedContent(userData.language),
        priority: 2
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  adjustDifficulty(currentLevel: number, recentScores: number[]): number {
    if (recentScores.length < 3) return currentLevel;

    const averageScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    
    if (averageScore >= 90 && currentLevel < 5) {
      return currentLevel + 1;
    } else if (averageScore < 60 && currentLevel > 1) {
      return currentLevel - 1;
    }
    
    return currentLevel;
  }

  generatePersonalizedPath(userData: UserPerformanceData): LearningPath {
    const weakAreas = this.identifyWeakAreas(userData.scores);
    const lessons: LearningPathLesson[] = [];

    // Create lessons targeting weak areas
    weakAreas.forEach((area, index) => {
      lessons.push({
        id: `lesson_${area.category}_${index}`,
        title: `Master ${area.category}`,
        content: this.generateLessonContent(area, userData.language),
        difficulty: this.getDifficultyNumber(area.difficulty),
        targetSkills: [area.category],
        prerequisites: index > 0 ? [`lesson_${weakAreas[index-1].category}_${index-1}`] : [],
        estimatedTime: 20,
        isUnlocked: index === 0,
        isCompleted: false
      });
    });

    return {
      id: `path_${userData.userId}_${Date.now()}`,
      name: 'Personalized Pronunciation Path',
      description: 'Customized learning path based on your performance data',
      lessons,
      estimatedDuration: lessons.length * 20,
      targetLevel: this.getTargetLevel(userData.difficultyLevel),
      adaptiveFeatures: ['difficulty_adjustment', 'weak_area_focus', 'progress_tracking']
    };
  }

  private findLastImprovement(scores: number[]): Date | null {
    for (let i = scores.length - 1; i > 0; i--) {
      if (scores[i] > scores[i - 1] + this.IMPROVEMENT_THRESHOLD) {
        return new Date(Date.now() - (scores.length - i) * 24 * 60 * 60 * 1000);
      }
    }
    return null;
  }

  private getDifficultyLevel(score: number): 'easy' | 'medium' | 'hard' {
    if (score >= 70) return 'easy';
    if (score >= 50) return 'medium';
    return 'hard';
  }

  private getDifficultyNumber(difficulty: 'easy' | 'medium' | 'hard'): number {
    return { easy: 2, medium: 3, hard: 4 }[difficulty];
  }

  private analyzeSpecificSounds(scores: PronunciationScore[], category: string): string[] {
    // This would analyze the specific phonemes/sounds that are problematic
    // For now, return common problem sounds based on category
    const commonIssues: Record<string, string[]> = {
      accuracy: ['th', 'r', 'l', 'v', 'w'],
      fluency: ['consonant_clusters', 'word_linking', 'rhythm'],
      completeness: ['word_endings', 'syllable_stress'],
      prosody: ['intonation', 'stress_patterns', 'rhythm']
    };
    
    return commonIssues[category] || [];
  }

  private generatePracticeContent(area: WeakArea, language: string): string {
    const content: Record<string, Record<string, string>> = {
      afrikaans: {
        accuracy: 'Die kat sit op die mat en kyk na die muis.',
        fluency: 'Sy hardloop vinnig deur die park elke oggend vroeg.',
        completeness: 'Ons gaan môre na die winkel toe om kos te koop.',
        prosody: 'Hoekom is jy so hartseer vandag, my vriend?'
      },
      zulu: {
        accuracy: 'Ikati lihlezi phezu kwemathi libuka igundane.',
        fluency: 'Ugijima ngokushesha epaki nsuku zonke ekuseni.',
        completeness: 'Sizoya esitolo kusasa ukuyothenga ukudla.',
        prosody: 'Kungani udabukile namuhla, mngani wami?'
      }
    };

    return content[language]?.[area.category] || 'Practice sentence for pronunciation improvement.';
  }

  private generateLessonContent(area: WeakArea, language: string): string {
    return `Focused lesson content for improving ${area.category} in ${language} language.`;
  }

  private getAdvancedContent(language: string): string {
    const advanced: Record<string, string> = {
      afrikaans: 'Ses Suid-Afrikaanse seuns soek ses sout sakke.',
      zulu: 'Izinkomo ziyakhala ezindongeni zikhalela amanzi.'
    };

    return advanced[language] || 'Advanced pronunciation challenge content.';
  }

  private getTargetLevel(currentLevel: number): string {
    const levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
    return levels[Math.min(currentLevel, levels.length - 1)] || 'Intermediate';
  }
}