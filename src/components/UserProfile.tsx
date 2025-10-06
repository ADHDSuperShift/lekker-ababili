import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { CacheManager } from './CacheManager';
import { Camera, Save, User, Globe, Bell, Settings, Trophy, Target, BookOpen, Mic, Headphones, PenTool } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, updateProfile, updateProgress } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    nativeLanguage: user?.nativeLanguage || 'Afrikaans',
    targetLanguage: user?.targetLanguage || 'Spanish',
  });
  const [notifications, setNotifications] = useState(user?.notifications || {
    dailyReminders: true,
    weeklyProgress: true,
    achievements: true,
    marketing: false,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
      });
      setNotifications(user.notifications);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!user) return;
    
    updateProfile({
      ...formData,
      notifications,
    });
    
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const simulateProgress = () => {
    if (!user) return;
    
    const newWordsLearned = Math.min(user.progress.wordsLearned + 10, user.progress.totalWords);
    const newStreak = user.progress.streakDays + 1;
    const newLevel = Math.floor(newWordsLearned / 100) + 1;
    
    updateProgress({
      wordsLearned: newWordsLearned,
      streakDays: newStreak,
      level: newLevel,
      skillLevels: {
        speaking: Math.min(user.progress.skillLevels.speaking + 5, 100),
        listening: Math.min(user.progress.skillLevels.listening + 3, 100),
        reading: Math.min(user.progress.skillLevels.reading + 7, 100),
        writing: Math.min(user.progress.skillLevels.writing + 4, 100),
      },
    });
  };

  if (!user) return null;
  const languages = [
    { value: 'Afrikaans', label: 'Afrikaans', flag: '🇿🇦' },
    { value: 'Zulu', label: 'isiZulu', flag: '🇿🇦' },
    { value: 'Spanish', label: 'Español', flag: '🇪🇸' },
    { value: 'French', label: 'Français', flag: '🇫🇷' },
    { value: 'German', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'Italian', label: 'Italiano', flag: '🇮🇹' },
    { value: 'Portuguese', label: 'Português', flag: '🇵🇹' },
    { value: 'Russian', label: 'Русский', flag: '🇷🇺' },
    { value: 'Chinese', label: '中文', flag: '🇨🇳' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || user.profilePicture} />
                  <AvatarFallback className="bg-orange-100 text-orange-800 text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {user.name}
                  {hasUnsavedChanges && <Badge variant="secondary" className="text-xs">Unsaved</Badge>}
                </CardTitle>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    🔥 {user.progress.streakDays} Day Streak
                  </Badge>
                  <Badge variant="outline">⭐ Level {user.progress.level}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {hasUnsavedChanges && (
                <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Native Language</Label>
              <Select 
                value={formData.nativeLanguage} 
                onValueChange={(value) => handleInputChange('nativeLanguage', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.filter(l => ['Afrikaans', 'Zulu'].includes(l.value)).map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Language</Label>
              <Select 
                value={formData.targetLanguage} 
                onValueChange={(value) => handleInputChange('targetLanguage', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Learning Progress
            </CardTitle>
            <p className="text-gray-600 mt-1">
              {user.progress.wordsLearned} of {user.progress.totalWords} words learned
            </p>
          </div>
          <Button onClick={simulateProgress} variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Practice Session
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Skill Progress</span>
              </div>
              {[
                { skill: 'Speaking', progress: user.progress.skillLevels.speaking, icon: Mic },
                { skill: 'Listening', progress: user.progress.skillLevels.listening, icon: Headphones },
                { skill: 'Reading', progress: user.progress.skillLevels.reading, icon: BookOpen },
                { skill: 'Writing', progress: user.progress.skillLevels.writing, icon: PenTool }
              ].map(({ skill, progress, icon: Icon }) => (
                <div key={skill}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{skill}</span>
                    </div>
                    <Badge variant="outline">
                      {progress < 30 ? 'Beginner' : progress < 70 ? 'Intermediate' : 'Advanced'}
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-1">{progress}% Complete</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange-600" />
                Achievements
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: '7-Day Streak', icon: '🔥', earned: user.progress.streakDays >= 7 },
                  { title: 'First 100 Words', icon: '💬', earned: user.progress.wordsLearned >= 100 },
                  { title: 'Grammar Master', icon: '📚', earned: user.progress.level >= 3 },
                  { title: 'Speaking Pro', icon: '🎯', earned: user.progress.skillLevels.speaking >= 70 }
                ].map((achievement) => (
                  <div key={achievement.title} className={`p-3 rounded-lg border text-center transition-colors ${
                    achievement.earned 
                      ? 'bg-orange-50 border-orange-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}>
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <p className={`text-sm font-medium ${
                      achievement.earned ? 'text-orange-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'dailyReminders', label: 'Daily Learning Reminders', description: 'Get reminded to practice daily' },
            { key: 'weeklyProgress', label: 'Weekly Progress Reports', description: 'Receive weekly summaries of your progress' },
            { key: 'achievements', label: 'Achievement Notifications', description: 'Get notified when you earn new badges' },
            { key: 'marketing', label: 'Marketing Communications', description: 'Receive updates about new features and offers' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{setting.label}</Label>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <Switch
                checked={notifications[setting.key as keyof typeof notifications]}
                onCheckedChange={(checked) => handleNotificationChange(setting.key, checked)}
                disabled={!isEditing}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cache Manager */}
      <CacheManager />
    </div>
  );
};

export default UserProfile;