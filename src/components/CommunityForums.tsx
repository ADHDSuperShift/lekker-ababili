import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { MessageSquare, ThumbsUp, Pin, Plus, Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatar?: string;
  content: string;
  category: string;
  language: string;
  level: string;
  replies: number;
  likes: number;
  isPinned: boolean;
  timestamp: string;
  lastReply: string;
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best resources for Spanish pronunciation?',
    author: 'Alex Johnson',
    content: 'I\'m struggling with rolling Rs in Spanish. Any native speakers have tips?',
    category: 'Pronunciation',
    language: 'Spanish',
    level: 'Beginner',
    replies: 15,
    likes: 23,
    isPinned: false,
    timestamp: '2025-09-20T08:30:00Z',
    lastReply: '2025-09-20T14:20:00Z'
  },
  {
    id: '2',
    title: 'French Grammar Challenge - Subjunctive Mood',
    author: 'Marie Dubois',
    content: 'Let\'s practice the subjunctive mood together! I\'ll post examples.',
    category: 'Grammar',
    language: 'French',
    level: 'Advanced',
    replies: 8,
    likes: 31,
    isPinned: true,
    timestamp: '2025-09-19T16:45:00Z',
    lastReply: '2025-09-20T12:15:00Z'
  },
  {
    id: '3',
    title: 'German Cultural Insights: Oktoberfest Traditions',
    author: 'Hans Weber',
    content: 'As a native German, I\'d love to share some real Oktoberfest traditions!',
    category: 'Culture',
    language: 'German',
    level: 'Intermediate',
    replies: 22,
    likes: 45,
    isPinned: false,
    timestamp: '2025-09-19T10:20:00Z',
    lastReply: '2025-09-20T11:30:00Z'
  }
];

export const CommunityForums: React.FC = () => {
  const [posts] = useState<ForumPost[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Grammar', 'Pronunciation', 'Culture', 'Practice', 'Resources'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Forums</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category === 'all' ? 'All' : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      {post.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
                      <h3 className="font-semibold hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">{post.language}</Badge>
                        <Badge variant="outline" className="text-xs">{post.level}</Badge>
                        <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <span>{formatTimeAgo(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};