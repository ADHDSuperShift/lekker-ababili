import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Edit, Trash2, FileText, Video, Headphones, Mic, BookOpen } from 'lucide-react';

export function ContentManager() {
  const [activeTab, setActiveTab] = useState('lessons');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const lessons = [
    {
      id: 1,
      title: 'Basic Greetings',
      language: 'Spanish',
      level: 'Beginner',
      type: 'vocabulary',
      status: 'published',
      completions: 1250,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Past Tense Conjugation',
      language: 'French',
      level: 'Intermediate',
      type: 'grammar',
      status: 'draft',
      completions: 0,
      rating: 0
    }
  ];

  const audioContent = [
    {
      id: 1,
      title: 'Pronunciation Guide: Spanish R',
      language: 'Spanish',
      duration: '3:45',
      type: 'pronunciation',
      status: 'published',
      plays: 2340
    },
    {
      id: 2,
      title: 'Listening Exercise: Restaurant',
      language: 'French',
      duration: '5:20',
      type: 'listening',
      status: 'published',
      plays: 1890
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Exercises
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{lesson.title}</h3>
                        <Badge className={getStatusColor(lesson.status)}>
                          {lesson.status}
                        </Badge>
                        <Badge className={getLevelColor(lesson.level)}>
                          {lesson.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{lesson.language}</span>
                        <span>{lesson.type}</span>
                        <span>{lesson.completions} completions</span>
                        {lesson.rating > 0 && <span>⭐ {lesson.rating}/5</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audio Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audioContent.map((audio) => (
                  <div key={audio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{audio.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{audio.language}</span>
                          <span>{audio.duration}</span>
                          <span>{audio.plays} plays</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(audio.status)}>
                        {audio.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No exercises created yet</p>
                <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
                  Create First Exercise
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No media files uploaded yet</p>
                <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
                  Upload Media
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Title</label>
                <Input placeholder="Enter content title" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson">Lesson</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea placeholder="Describe the content" rows={3} />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button>Create Content</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}