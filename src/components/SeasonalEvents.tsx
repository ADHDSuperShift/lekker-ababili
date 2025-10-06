import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Calendar, Gift, Star, Trophy, Clock, Users, Sparkles } from 'lucide-react';

export const SeasonalEvents: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('winter');

  const currentEvent = {
    id: 'winter',
    name: 'Winter Language Festival',
    description: 'Celebrate the season with special challenges and exclusive rewards!',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    daysLeft: 15,
    theme: 'winter',
    backgroundGradient: 'from-blue-100 to-purple-100'
  };

  const eventChallenges = [
    {
      id: 1,
      title: 'Snowflake Vocabulary',
      description: 'Learn 100 winter-themed words',
      progress: 65,
      target: 100,
      reward: 'Winter Vocabulary Badge',
      xp: 500,
      type: 'vocabulary'
    },
    {
      id: 2,
      title: 'Holiday Conversations',
      description: 'Complete 10 holiday-themed chat sessions',
      progress: 7,
      target: 10,
      reward: 'Holiday Chatter Badge',
      xp: 750,
      type: 'conversation'
    },
    {
      id: 3,
      title: 'Group Winter Quest',
      description: 'Work with your study group to complete winter challenges',
      progress: 3,
      target: 5,
      reward: 'Team Spirit Badge',
      xp: 1000,
      type: 'collaborative'
    }
  ];

  const exclusiveRewards = [
    {
      id: 1,
      name: 'Snowflake Avatar Frame',
      description: 'Exclusive winter-themed profile frame',
      rarity: 'Epic',
      unlocked: true
    },
    {
      id: 2,
      name: 'Winter Wonderland Background',
      description: 'Beautiful snowy landscape for your profile',
      rarity: 'Rare',
      unlocked: false
    },
    {
      id: 3,
      name: 'Holiday Language Pack',
      description: 'Special holiday phrases and expressions',
      rarity: 'Legendary',
      unlocked: false
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', points: 2850, badge: 'Winter Champion' },
    { rank: 2, name: 'Miguel Rodriguez', points: 2720, badge: 'Frost Master' },
    { rank: 3, name: 'Emma Johnson', points: 2650, badge: 'Snow Scholar' },
    { rank: 4, name: 'You', points: 2400, badge: 'Ice Breaker' },
    { rank: 5, name: 'Alex Kim', points: 2350, badge: 'Winter Warrior' }
  ];

  const upcomingEvents = [
    {
      id: 'spring',
      name: 'Spring Language Bloom',
      startDate: '2025-03-01',
      preview: 'Garden-themed vocabulary and nature conversations'
    },
    {
      id: 'cultural',
      name: 'Cultural Heritage Month',
      startDate: '2025-02-01',
      preview: 'Explore languages through cultural traditions'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Event Header */}
      <Card className={`bg-gradient-to-r ${currentEvent.backgroundGradient} border-2 border-blue-200`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl text-blue-800">{currentEvent.name}</CardTitle>
                <p className="text-blue-700 mt-1">{currentEvent.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-orange-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="font-bold">{currentEvent.daysLeft} days left</span>
              </div>
              <Badge variant="secondary">Active Event</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Event Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventChallenges.map(challenge => (
              <div key={challenge.id} className="border rounded-lg p-4 bg-gradient-to-r from-white to-blue-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-blue-800">{challenge.title}</h3>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                  <Badge 
                    variant={challenge.type === 'collaborative' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {challenge.xp} XP
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{challenge.progress}/{challenge.target}</span>
                    <span className="text-blue-600 font-medium">{challenge.reward}</span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.target) * 100} 
                    className="h-2"
                  />
                </div>
                
                {challenge.type === 'collaborative' && (
                  <div className="mt-2 flex items-center gap-1 text-purple-600">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Team Challenge</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Event Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              Event Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map(player => (
                <div 
                  key={player.rank} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.name === 'You' ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      player.rank === 1 ? 'bg-yellow-500 text-white' :
                      player.rank === 2 ? 'bg-gray-400 text-white' :
                      player.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-xs text-gray-600">{player.badge}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{player.points}</p>
                    <p className="text-xs text-gray-600">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exclusive Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            Exclusive Event Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exclusiveRewards.map(reward => (
              <div 
                key={reward.id} 
                className={`border rounded-lg p-4 text-center ${
                  reward.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="mb-3">
                  <Gift className={`h-8 w-8 mx-auto ${reward.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <h3 className={`font-medium mb-1 ${reward.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                  {reward.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                <Badge 
                  variant={reward.unlocked ? 'default' : 'secondary'}
                  className={
                    reward.rarity === 'Legendary' ? 'bg-purple-600' :
                    reward.rarity === 'Epic' ? 'bg-orange-600' :
                    reward.rarity === 'Rare' ? 'bg-blue-600' : ''
                  }
                >
                  {reward.rarity}
                </Badge>
                {reward.unlocked && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Unlocked!
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                <h3 className="font-medium text-blue-800 mb-1">{event.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.preview}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Starts: {event.startDate}</span>
                  <Button size="sm" variant="outline">
                    Get Notified
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};