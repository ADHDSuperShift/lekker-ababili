import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calendar, Plus, Edit, Trash2, Clock, Users, Gift } from 'lucide-react';

export function EventManager() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: '',
    startDate: '',
    endDate: '',
    rewards: '',
    requirements: ''
  });

  const events = [
    {
      id: 1,
      title: 'Spring Language Festival',
      description: 'Celebrate spring with special challenges and cultural activities',
      type: 'seasonal',
      startDate: '2024-03-20',
      endDate: '2024-04-20',
      status: 'active',
      participants: 2450,
      rewards: ['Spring Badge', '500 XP Bonus', 'Exclusive Avatar'],
      theme: 'spring'
    },
    {
      id: 2,
      title: 'Global Conversation Week',
      description: 'Connect with learners worldwide for intensive conversation practice',
      type: 'community',
      startDate: '2024-04-15',
      endDate: '2024-04-22',
      status: 'upcoming',
      participants: 0,
      rewards: ['Conversation Master Badge', '1000 XP', 'Premium Week Trial'],
      theme: 'community'
    },
    {
      id: 3,
      title: 'Winter Learning Marathon',
      description: 'Complete daily challenges throughout the winter season',
      type: 'seasonal',
      startDate: '2023-12-21',
      endDate: '2024-03-20',
      status: 'completed',
      participants: 5670,
      rewards: ['Winter Champion Badge', '2000 XP', 'Special Certificate'],
      theme: 'winter'
    }
  ];

  const handleCreateEvent = () => {
    console.log('Creating event:', newEvent);
    setShowCreateForm(false);
    setNewEvent({
      title: '',
      description: '',
      type: '',
      startDate: '',
      endDate: '',
      rewards: '',
      requirements: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'spring': return 'bg-green-500';
      case 'summer': return 'bg-yellow-500';
      case 'autumn': return 'bg-orange-500';
      case 'winter': return 'bg-blue-500';
      case 'community': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Event Title</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Describe the event"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Event Type</label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">1 Week</SelectItem>
                    <SelectItem value="2weeks">2 Weeks</SelectItem>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Start Date</label>
                <Input
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">End Date</label>
                <Input
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Rewards (comma-separated)</label>
                <Input
                  value={newEvent.rewards}
                  onChange={(e) => setNewEvent({...newEvent, rewards: e.target.value})}
                  placeholder="Special Badge, 1000 XP, Premium Trial"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleCreateEvent}>Create Event</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${getThemeColor(event.theme)}`}></div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{event.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{event.participants.toLocaleString()} participants</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <Gift className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {event.rewards.map((reward, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {event.status === 'active' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Event is currently active!</div>
                  <div className="text-xs text-green-600 mt-1">
                    {Math.ceil((new Date(event.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}