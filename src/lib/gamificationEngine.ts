interface UserStats {
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  achievements: string[];
  dailyGoals: DailyGoal[];
  weeklyXP: number;
  totalPronunciationScore: number;
  pronunciationSessions: number;
  lastActivityDate: string;
}

interface DailyGoal {
  id: string;
  type: 'pronunciation' | 'lessons' | 'streak' | 'accuracy';
  target: number;
  current: number;
  xp: number;
  completed: boolean;
  date: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockCondition: (stats: UserStats) => boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'pronunciation' | 'daily' | 'weekly' | 'social';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  target: number;
  xp: number;
  timeLimit?: number;
  participants?: number;
}

export class GamificationEngine {
  private static instance: GamificationEngine;
  private userStats: UserStats;
  private badges: Badge[];
  private challenges: Challenge[];

  private constructor() {
    this.userStats = this.loadUserStats();
    this.badges = this.initializeBadges();
    this.challenges = this.initializeChallenges();
  }

  static getInstance(): GamificationEngine {
    if (!GamificationEngine.instance) {
      GamificationEngine.instance = new GamificationEngine();
    }
    return GamificationEngine.instance;
  }

  private loadUserStats(): UserStats {
    const saved = localStorage.getItem('gamification_stats');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      level: 1,
      xp: 0,
      streak: 0,
      badges: [],
      achievements: [],
      dailyGoals: this.generateDailyGoals(),
      weeklyXP: 0,
      totalPronunciationScore: 0,
      pronunciationSessions: 0,
      lastActivityDate: new Date().toISOString().split('T')[0]
    };
  }

  private saveUserStats(): void {
    localStorage.setItem('gamification_stats', JSON.stringify(this.userStats));
  }

  private generateDailyGoals(): DailyGoal[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'pronunciation_practice',
        type: 'pronunciation',
        target: 5,
        current: 0,
        xp: 100,
        completed: false,
        date: today
      },
      {
        id: 'accuracy_goal',
        type: 'accuracy',
        target: 85,
        current: 0,
        xp: 150,
        completed: false,
        date: today
      },
      {
        id: 'streak_maintain',
        type: 'streak',
        target: 1,
        current: 0,
        xp: 50,
        completed: false,
        date: today
      }
    ];
  }

  private initializeBadges(): Badge[] {
    return [
      {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first pronunciation session',
        icon: '👶',
        rarity: 'Common',
        unlockCondition: (stats) => stats.pronunciationSessions >= 1
      },
      {
        id: 'pronunciation_novice',
        name: 'Pronunciation Novice',
        description: 'Complete 10 pronunciation sessions',
        icon: '🗣️',
        rarity: 'Common',
        unlockCondition: (stats) => stats.pronunciationSessions >= 10
      },
      {
        id: 'accuracy_master',
        name: 'Accuracy Master',
        description: 'Achieve 95% accuracy in pronunciation',
        icon: '🎯',
        rarity: 'Rare',
        unlockCondition: (stats) => stats.totalPronunciationScore / stats.pronunciationSessions >= 95
      },
      {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Maintain a 30-day streak',
        icon: '🔥',
        rarity: 'Epic',
        unlockCondition: (stats) => stats.streak >= 30
      },
      {
        id: 'pronunciation_legend',
        name: 'Pronunciation Legend',
        description: 'Complete 100 pronunciation sessions with 90% average accuracy',
        icon: '👑',
        rarity: 'Legendary',
        unlockCondition: (stats) => stats.pronunciationSessions >= 100 && 
          (stats.totalPronunciationScore / stats.pronunciationSessions) >= 90
      }
    ];
  }

  private initializeChallenges(): Challenge[] {
    return [
      {
        id: 'daily_pronunciation',
        title: 'Daily Pronunciation Challenge',
        description: 'Complete 5 pronunciation exercises today',
        type: 'daily',
        difficulty: 'Easy',
        target: 5,
        xp: 100
      },
      {
        id: 'accuracy_challenge',
        title: 'Accuracy Challenge',
        description: 'Achieve 90% accuracy in 3 consecutive sessions',
        type: 'pronunciation',
        difficulty: 'Medium',
        target: 3,
        xp: 200
      },
      {
        id: 'weekly_marathon',
        title: 'Weekly Marathon',
        description: 'Complete 25 pronunciation sessions this week',
        type: 'weekly',
        difficulty: 'Hard',
        target: 25,
        xp: 500
      },
      {
        id: 'social_challenge',
        title: 'Community Challenge',
        description: 'Compete with friends in pronunciation accuracy',
        type: 'social',
        difficulty: 'Medium',
        target: 1,
        xp: 300,
        participants: 0
      }
    ];
  }

  recordPronunciationSession(score: number): { xpGained: number; levelUp: boolean; newBadges: Badge[] } {
    this.updateStreak();
    
    const xpGained = this.calculateXP(score);
    this.userStats.xp += xpGained;
    this.userStats.weeklyXP += xpGained;
    this.userStats.totalPronunciationScore += score;
    this.userStats.pronunciationSessions++;
    
    // Update daily goals
    this.updateDailyGoals('pronunciation', 1);
    if (score >= 85) {
      this.updateDailyGoals('accuracy', score);
    }
    
    const levelUp = this.checkLevelUp();
    const newBadges = this.checkNewBadges();
    
    this.saveUserStats();
    
    return { xpGained, levelUp, newBadges };
  }

  private calculateXP(score: number): number {
    let baseXP = 20;
    
    // Bonus XP for high accuracy
    if (score >= 95) baseXP += 30;
    else if (score >= 90) baseXP += 20;
    else if (score >= 85) baseXP += 10;
    
    // Streak bonus
    if (this.userStats.streak >= 7) baseXP += 10;
    if (this.userStats.streak >= 30) baseXP += 20;
    
    return baseXP;
  }

  private updateStreak(): void {
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = this.userStats.lastActivityDate;
    
    if (lastActivity === today) {
      return; // Already practiced today
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastActivity === yesterdayStr) {
      this.userStats.streak++;
    } else {
      this.userStats.streak = 1;
    }
    
    this.userStats.lastActivityDate = today;
    this.updateDailyGoals('streak', 1);
  }

  private updateDailyGoals(type: string, value: number): void {
    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily goals if new day
    if (this.userStats.dailyGoals[0]?.date !== today) {
      this.userStats.dailyGoals = this.generateDailyGoals();
    }
    
    this.userStats.dailyGoals.forEach(goal => {
      if (goal.type === type && !goal.completed) {
        if (type === 'accuracy') {
          goal.current = Math.max(goal.current, value);
        } else {
          goal.current += value;
        }
        
        if (goal.current >= goal.target) {
          goal.completed = true;
          this.userStats.xp += goal.xp;
        }
      }
    });
  }

  private checkLevelUp(): boolean {
    const xpForNextLevel = this.userStats.level * 1000;
    if (this.userStats.xp >= xpForNextLevel) {
      this.userStats.level++;
      return true;
    }
    return false;
  }

  private checkNewBadges(): Badge[] {
    const newBadges: Badge[] = [];
    
    this.badges.forEach(badge => {
      if (!this.userStats.badges.includes(badge.id) && badge.unlockCondition(this.userStats)) {
        this.userStats.badges.push(badge.id);
        newBadges.push(badge);
      }
    });
    
    return newBadges;
  }

  getUserStats(): UserStats {
    return { ...this.userStats };
  }

  getBadges(): Badge[] {
    return this.badges;
  }

  getChallenges(): Challenge[] {
    return this.challenges;
  }

  getLeaderboard(): any[] {
    // Mock leaderboard data - in real app, this would come from server
    return [
      { id: '1', name: 'Thabo Mthembu', points: 2450, streak: 15, level: 8, rank: 1 },
      { id: '2', name: 'Sarah van der Merwe', points: 2380, streak: 12, level: 7, rank: 2 },
      { id: '3', name: 'Nomsa Dlamini', points: 2290, streak: 8, level: 6, rank: 3 },
      { id: '4', name: 'You', points: this.userStats.xp, streak: this.userStats.streak, level: this.userStats.level, rank: 4 }
    ];
  }
}