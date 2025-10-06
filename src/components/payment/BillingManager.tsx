import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CreditCard, Download, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

export const BillingManager: React.FC = () => {
  const { subscription } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    // Simulate loading billing data
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCancelSubscription = async () => {
    try {
      // Simulate cancellation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Subscription cancelled');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Current Subscription
        </CardTitle>
      </CardHeader>
      <CardContent>
        {subscription.plan === 'free' ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're currently on the free plan. Upgrade to unlock premium features.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Plan</span>
              <Badge>{subscription.plan}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Price</span>
              <span>R{subscription.plan === 'basic' ? '149.99' : subscription.plan === 'premium' ? '299.99' : '599.99'}/month</span>
            </div>
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="w-full"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};