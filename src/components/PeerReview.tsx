import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Star, Play, Pause, ThumbsUp, MessageSquare, Upload } from 'lucide-react';

interface PronunciationSubmission {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  audioUrl: string;
  language: string;
  difficulty: string;
  timestamp: string;
  reviews: Review[];
  averageRating: number;
}

interface Review {
  id: string;
  reviewer: string;
  rating: number;
  feedback: string;
  timestamp: string;
}

const mockSubmissions: PronunciationSubmission[] = [
  {
    id: '1',
    user: 'Sarah Chen',
    text: 'Bonjour, comment allez-vous aujourd\'hui?',
    audioUrl: '/audio/sample1.mp3',
    language: 'French',
    difficulty: 'Beginner',
    timestamp: '2025-09-20T10:30:00Z',
    reviews: [
      { id: '1', reviewer: 'Pierre', rating: 4, feedback: 'Good pronunciation! Work on the "r" sound.', timestamp: '2025-09-20T11:00:00Z' }
    ],
    averageRating: 4.2
  },
  {
    id: '2',
    user: 'You',
    text: 'Hola, ¿cómo está usted?',
    audioUrl: '/audio/sample2.mp3',
    language: 'Spanish',
    difficulty: 'Intermediate',
    timestamp: '2025-09-20T09:15:00Z',
    reviews: [
      { id: '2', reviewer: 'Maria', rating: 5, feedback: 'Excellent accent! Very natural.', timestamp: '2025-09-20T09:45:00Z' },
      { id: '3', reviewer: 'Carlos', rating: 4, feedback: 'Great job! Minor improvement on stress.', timestamp: '2025-09-20T10:00:00Z' }
    ],
    averageRating: 4.5
  }
];

export const PeerReview: React.FC = () => {
  const [submissions] = useState<PronunciationSubmission[]>(mockSubmissions);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const handlePlayPause = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Peer Review</h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Submit Recording
        </Button>
      </div>

      <div className="grid gap-6">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={submission.avatar} />
                    <AvatarFallback>{submission.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{submission.user}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Badge variant="outline">{submission.language}</Badge>
                      <Badge variant="outline">{submission.difficulty}</Badge>
                      <span>{new Date(submission.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(submission.averageRating)}
                  <span className="text-sm text-gray-600">({submission.reviews.length})</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-lg font-medium mb-2">"{submission.text}"</p>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayPause(submission.id)}
                  >
                    {playingId === submission.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
                  </div>
                </div>
              </div>

              {submission.reviews.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Reviews:</h4>
                  {submission.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{review.reviewer}</span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-700">{review.feedback}</p>
                    </div>
                  ))}
                </div>
              )}

              {submission.user !== 'You' && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium">Leave a Review:</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Rating:</span>
                    {renderStars(selectedRating, true, setSelectedRating)}
                  </div>
                  <Textarea
                    placeholder="Provide constructive feedback..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Submit Review
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Private Message
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};