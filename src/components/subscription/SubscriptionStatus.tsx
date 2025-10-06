import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Crown, Star, AlertTriangle, Zap } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const SubscriptionStatus: React.FC = () => {
  const { subscription, getRemainingUsage } = useSubscription();

  const getPlanIcon = () => {
    switch (subscription.plan) {
      case 'premium':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'pro':
        return <Star className="h-5 w-5 text-blue-600" />;
      default:
        return <Zap className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPlanColor = () => {
    switch (subscription.plan) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = (type: 'translations' | 'speechMinutes' | 'ocrScans') => {
    const remaining = getRemainingUsage(type);
    if (remaining === 'unlimited') return 0;
    
    const limit = subscription.features[type] as number;
    const used = subscription.usage[type];
    return (used / limit) * 100;
  };

  const isLowUsage = (type: 'translations' | 'speechMinutes' | 'ocrScans') => {
    const remaining = getRemainingUsage(type);
    if (remaining === 'unlimited') return false;
    return (remaining as number) < 5;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            {getPlanIcon()}
            <span className="ml-2">Subscription Status</span>
          </span>
          <Badge className={getPlanColor()}>
            {subscription.plan.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {subscription.isTrialActive && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="font-medium text-yellow-800">Trial Active</p>
                <p className="text-sm text-yellow-700">
                  {subscription.trialDaysLeft} days remaining
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Usage This Month</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Translations</span>
                <span className={isLowUsage('translations') ? 'text-red-600 font-medium' : ''}>
                  {subscription.usage.translations} / {
                    subscription.features.translations === 'unlimited' 
                      ? '∞' 
                      : subscription.features.translations
                  }
                </span>
              </div>
              {subscription.features.translations !== 'unlimited' && (
                <Progress 
                  value={getUsagePercentage('translations')} 
                  className={`h-2 ${isLowUsage('translations') ? 'bg-red-100' : ''}`}
                />
              )}
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Speech (minutes)</span>
                <span className={isLowUsage('speechMinutes') ? 'text-red-600 font-medium' : ''}>
                  {subscription.usage.speechMinutes} / {
                    subscription.features.speechMinutes === 'unlimited' 
                      ? '∞' 
                      : subscription.features.speechMinutes
                  }
                </span>
              </div>
              {subscription.features.speechMinutes !== 'unlimited' && (
                <Progress 
                  value={getUsagePercentage('speechMinutes')} 
                  className={`h-2 ${isLowUsage('speechMinutes') ? 'bg-red-100' : ''}`}
                />
              )}
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>OCR Scans</span>
                <span className={isLowUsage('ocrScans') ? 'text-red-600 font-medium' : ''}>
                  {subscription.usage.ocrScans} / {
                    subscription.features.ocrScans === 'unlimited' 
                      ? '∞' 
                      : subscription.features.ocrScans
                  }
                </span>
              </div>
              {subscription.features.ocrScans !== 'unlimited' && (
                <Progress 
                  value={getUsagePercentage('ocrScans')} 
                  className={`h-2 ${isLowUsage('ocrScans') ? 'bg-red-100' : ''}`}
                />
              )}
            </div>
          </div>
        </div>

        {subscription.plan === 'free' && (
          <div className="pt-3 border-t">
            <Button className="w-full" size="sm">
              Upgrade to Pro
            </Button>
            <p className="text-xs text-gray-600 text-center mt-2">
              Get unlimited translations and more features
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;