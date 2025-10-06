import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Search, MoreHorizontal, Ban, UserCheck, Mail, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      avatar: '/api/placeholder/32/32',
      level: 15,
      language: 'Spanish',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      xp: 12450,
      streak: 28
    },
    {
      id: 2,
      name: 'Miguel Rodriguez',
      email: 'miguel.r@email.com',
      avatar: '/api/placeholder/32/32',
      level: 22,
      language: 'English',
      status: 'active',
      joinDate: '2023-11-08',
      lastActive: '1 day ago',
      xp: 18900,
      streak: 45
    },
    {
      id: 3,
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      avatar: '/api/placeholder/32/32',
      level: 8,
      language: 'French',
      status: 'suspended',
      joinDate: '2024-03-22',
      lastActive: '1 week ago',
      xp: 5200,
      streak: 0
    },
    {
      id: 4,
      name: 'Hiroshi Tanaka',
      email: 'h.tanaka@email.com',
      avatar: '/api/placeholder/32/32',
      level: 31,
      language: 'German',
      status: 'premium',
      joinDate: '2023-08-12',
      lastActive: '30 minutes ago',
      xp: 28750,
      streak: 67
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                size="sm"
              >
                All Users
              </Button>
              <Button
                variant={selectedFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('active')}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={selectedFilter === 'premium' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('premium')}
                size="sm"
              >
                Premium
              </Button>
              <Button
                variant={selectedFilter === 'suspended' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('suspended')}
                size="sm"
              >
                Suspended
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{user.name}</h3>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span>Level {user.level}</span>
                      <span>{user.xp.toLocaleString()} XP</span>
                      <span>{user.streak} day streak</span>
                      <span>Learning {user.language}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm">
                    <div className="text-gray-500">Last active</div>
                    <div>{user.lastActive}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <UserCheck className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="w-4 h-4 mr-2" />
                        View Activity
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Ban className="w-4 h-4 mr-2" />
                        Suspend User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}