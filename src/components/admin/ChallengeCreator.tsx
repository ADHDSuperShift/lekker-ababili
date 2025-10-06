import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Target, Clock, Trophy } from 'lucide-react';

export function ChallengeCreator() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: '',
    difficulty: '',
    language: '',
    xpReward: '',
    duration: '',
    requirements: ''
  });

  const challenges = [
    {
      id: 1,
      title: 'Daily Vocabulary Sprint',
      description: 'Learn 20 new words in your target language',
      type: 'vocabulary',
      difficulty: 'beginner',
      language: 'Spanish',
      xpReward: 100,
      duration: '1 day',
      active: true,
      participants: 1250
    },
    {
      id: 2,
      title: 'Conversation Marathon',
      description: 'Complete 5 conversation exercises without mistakes',
      type: 'speaking',
      difficulty: 'intermediate',
      language: 'French',
      xpReward: 250,
      duration: '3 days',
      active: true,
      participants: 890
    },
    {
      id: 3,
      title: 'Grammar Master Challenge',
      description: 'Perfect score on advanced grammar quiz',
      type: 'grammar',
      difficulty: 'advanced',
      language: 'German',
      xpReward: 500,
      duration: '1 week',
      active: false,
      participants: 456
    }
  ];

  const handleCreateChallenge = () => {
    // Handle challenge creation
    console.log('Creating challenge:', newChallenge);
    setShowCreateForm(false);
    setNewChallenge({
      title: '',
      description: '',
      type: '',
      difficulty: '',
      language: '',
      xpReward: '',
      duration: '',
      requirements: ''
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Challenge Management</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Challenge Title</label>
                <Input
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                  placeholder="Enter challenge title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">XP Reward</label>
                <Input
                  type="number"
                  value={newChallenge.xpReward}
                  onChange={(e) => setNewChallenge({...newChallenge, xpReward: e.target.value})}
                  placeholder="100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Describe the challenge objectives"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Challenge Type</label>
                <Select value={newChallenge.type} onValueChange={(value) => setNewChallenge({...newChallenge, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={newChallenge.difficulty} onValueChange={(value) => setNewChallenge({...newChallenge, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select value={newChallenge.language} onValueChange={(value) => setNewChallenge({...newChallenge, language: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <Select value={newChallenge.duration} onValueChange={(value) => setNewChallenge({...newChallenge, duration: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 day">1 Day</SelectItem>
                    <SelectItem value="3 days">3 Days</SelectItem>
                    <SelectItem value="1 week">1 Week</SelectItem>
                    <SelectItem value="2 weeks">2 Weeks</SelectItem>
                    <SelectItem value="1 month">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleCreateChallenge}>Create Challenge</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{challenge.title}</h3>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant={challenge.active ? 'default' : 'secondary'}>
                      {challenge.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {challenge.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {challenge.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {challenge.xpReward} XP
                    </span>
                    <span>{challenge.participants} participants</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}