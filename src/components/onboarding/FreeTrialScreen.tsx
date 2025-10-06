import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FreeTrialScreenProps {
  onStartTrial: () => void;
}

const FreeTrialScreen: React.FC<FreeTrialScreenProps> = ({ onStartTrial }) => {
  const features = [
    { icon: '🎯', title: 'Personalized Learning', desc: 'AI-powered lessons adapted to your pace' },
    { icon: '🗣️', title: 'Speech Recognition', desc: 'Perfect your pronunciation with AI feedback' },
    { icon: '📱', title: 'Camera Translation', desc: 'Instant translation using your camera' },
    { icon: '📚', title: 'Interactive Lessons', desc: 'Engaging content with cultural context' },
    { icon: '🏆', title: 'Progress Tracking', desc: 'Monitor your learning journey' },
    { icon: '💬', title: 'Conversation Practice', desc: 'Practice with native speakers' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 text-center">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/68cecce95e2e2932f627e0b4_1758387604676_0a0fc14b.webp" 
          alt="Lekker Ababili" 
          className="w-16 h-16 mx-auto mb-4 rounded-xl"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Start Your Free Trial
        </h1>
        <p className="text-gray-600">
          Unlock all premium features for 7 days, completely free
        </p>
      </div>

      {/* Features */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <div className="grid gap-4 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pricing Info */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl mb-4">
              <p className="text-2xl font-bold text-gray-800 mb-1">
                7 Days Free
              </p>
              <p className="text-gray-600 mb-2">
                Then R199/month
              </p>
              <p className="text-sm text-gray-500">
                Cancel anytime during your trial
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onStartTrial}
            className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            Start My Free Trial
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            No commitment • Cancel anytime • Secure payment
          </p>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div 
        className="h-16 opacity-10"
        style={{
          backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68cecce95e2e2932f627e0b4_1758387608091_9d15d3a1.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  );
};

export default FreeTrialScreen;