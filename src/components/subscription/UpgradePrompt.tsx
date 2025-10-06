import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, Crown, Lock } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface UpgradePromptProps {
  feature: string;
  requiredPlan: 'pro' | 'premium';
  onUpgrade?: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ 
  feature, 
  requiredPlan, 
  onUpgrade 
}) => {
  const { subscription, upgradeToPro, upgradeToPremium } = useSubscription();

  const handleUpgrade = () => {
    if (requiredPlan === 'pro') {
      upgradeToPro();
    } else {
      upgradeToPremium();
    }
    onUpgrade?.();
  };

  const getPlanDetails = () => {
    if (requiredPlan === 'pro') {
      return {
        name: 'Pro',
        price: 'R199/month',
        icon: <Star className="h-5 w-5" />,
        color: 'bg-blue-500',
      };
    } else {
      return {
        name: 'Premium',
        price: 'R299/month',
        icon: <Crown className="h-5 w-5" />,
        color: 'bg-purple-500',
      };
    }
  };

  const planDetails = getPlanDetails();

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardContent className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gray-200 rounded-full">
            <Lock className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {feature} is locked
        </h3>
        
        <p className="text-gray-600 mb-4">
          Upgrade to {planDetails.name} to unlock this feature and many more!
        </p>

        <div className="flex justify-center mb-4">
          <Badge className={`${planDetails.color} text-white px-3 py-1`}>
            <span className="flex items-center">
              {planDetails.icon}
              <span className="ml-1">{planDetails.name} - {planDetails.price}</span>
            </span>
          </Badge>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleUpgrade}
            className="w-full"
          >
            Upgrade to {planDetails.name}
          </Button>
          
          {subscription.isTrialActive && (
            <p className="text-sm text-blue-600">
              ✨ {subscription.trialDaysLeft} days left in your free trial
            </p>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Cancel anytime • 7-day free trial</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;