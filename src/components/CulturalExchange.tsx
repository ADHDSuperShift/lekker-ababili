import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Globe, MessageCircle, Video, Heart, MapPin, Clock } from 'lucide-react';

interface CulturalPartner {
  id: string;
  name: string;
  avatar?: string;
  nativeLanguage: string;
  learningLanguage: string;
  country: string;
  city: string;
  interests: string[];
  isOnline: boolean;
  timeZone: string;
  matchScore: number;
  bio: string;
}

const mockPartners: CulturalPartner[] = [
  {
    id: '1',
    name: 'Isabella Martinez',
    nativeLanguage: 'Spanish',
    learningLanguage: 'English',
    country: 'Spain',
    city: 'Madrid',
    interests: ['Travel', 'Cooking', 'Art'],
    isOnline: true,
    timeZone: 'CET',
    matchScore: 95,
    bio: 'Art teacher passionate about cultural exchange and travel stories!'
  },
  {
    id: '2',
    name: 'Yuki Tanaka',
    nativeLanguage: 'Japanese',
    learningLanguage: 'English',
    country: 'Japan',
    city: 'Tokyo',
    interests: ['Anime', 'Technology', 'Music'],
    isOnline: false,
    timeZone: 'JST',
    matchScore: 88,
    bio: 'Software developer who loves sharing Japanese culture and learning about others.'
  },
  {
    id: '3',
    name: 'Pierre Dubois',
    nativeLanguage: 'French',
    learningLanguage: 'English',
    country: 'France',
    city: 'Lyon',
    interests: ['Food', 'Wine', 'History'],
    isOnline: true,
    timeZone: 'CET',
    matchScore: 82,
    bio: 'Chef and food enthusiast eager to share French culinary traditions.'
  }
];

export const CulturalExchange: React.FC = () => {
  const [partners] = useState<CulturalPartner[]>(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.nativeLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cultural Exchange</h2>
        <Button variant="outline">
          <Globe className="h-4 w-4 mr-2" />
          Find Partners
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Connect with Native Speakers</h3>
              <p className="text-gray-600">Practice with real people and learn about their cultures</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Input
          placeholder="Search by name, language, or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={partner.avatar} />
                    <AvatarFallback>{partner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {partner.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{partner.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {partner.city}, {partner.country}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {partner.matchScore}% match
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Native:</span>
                  <Badge variant="outline" className="ml-1">{partner.nativeLanguage}</Badge>
                </div>
                <div>
                  <span className="text-gray-500">Learning:</span>
                  <Badge variant="outline" className="ml-1">{partner.learningLanguage}</Badge>
                </div>
              </div>

              <p className="text-sm text-gray-600">{partner.bio}</p>

              <div className="flex flex-wrap gap-1">
                {partner.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {partner.timeZone}
                </div>
                <div className="flex items-center">
                  {partner.isOnline ? (
                    <span className="text-green-600">Online now</span>
                  ) : (
                    <span>Last seen 2h ago</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </Button>
                <Button size="sm" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};