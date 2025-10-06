import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Users, MessageCircle, Video, Plus, Search } from 'lucide-react';
import { Input } from './ui/input';

interface StudyGroup {
  id: string;
  name: string;
  language: string;
  level: string;
  members: number;
  maxMembers: number;
  description: string;
  isActive: boolean;
  nextSession: string;
}

const mockGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'Spanish Conversation Circle',
    language: 'Spanish',
    level: 'Intermediate',
    members: 8,
    maxMembers: 12,
    description: 'Practice everyday conversations in Spanish',
    isActive: true,
    nextSession: '2025-09-21 18:00'
  },
  {
    id: '2',
    name: 'French Business Talk',
    language: 'French',
    level: 'Advanced',
    members: 6,
    maxMembers: 10,
    description: 'Professional French for business scenarios',
    isActive: false,
    nextSession: '2025-09-22 19:30'
  },
  {
    id: '3',
    name: 'German Beginners',
    language: 'German',
    level: 'Beginner',
    members: 15,
    maxMembers: 15,
    description: 'Start your German journey with fellow beginners',
    isActive: true,
    nextSession: '2025-09-21 20:00'
  }
];

export const StudyGroups: React.FC = () => {
  const [groups] = useState<StudyGroup[]>(mockGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Groups</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search groups by name or language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                {group.isActive && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Live
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <Badge variant="outline">{group.language}</Badge>
                <Badge variant="outline">{group.level}</Badge>
              </div>
              
              <p className="text-sm text-gray-600">{group.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members}/{group.maxMembers}
                </div>
                <span className="text-gray-500">
                  Next: {new Date(group.nextSession).toLocaleDateString()}
                </span>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Join Chat
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4 mr-1" />
                  Video Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};