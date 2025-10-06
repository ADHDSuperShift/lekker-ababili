// Additional subscription context methods
import { stripeApi } from '../lib/stripe';
import { SubscriptionState, PaymentStatus } from './SubscriptionContext';

export const createSubscriptionMethods = (
  subscription: SubscriptionState,
  setSubscription: (state: SubscriptionState) => void
) => {
  const cancelSubscription = async () => {
    try {
      if (subscription.billing.subscriptionId) {
        await stripeApi.cancelSubscription(subscription.billing.subscriptionId);
        
        const newState = {
          ...subscription,
          billing: {
            ...subscription.billing,
            paymentStatus: 'canceled' as PaymentStatus,
          },
        };
        setSubscription(newState);
        localStorage.setItem('subscription', JSON.stringify(newState));
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const retryPayment = async () => {
    try {
      setSubscription({
        ...subscription,
        billing: {
          ...subscription.billing,
          paymentStatus: 'processing',
          lastPaymentFailed: false,
        },
      });

      // Simulate payment retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock 80% success rate
      const success = Math.random() > 0.2;
      
      const newState = {
        ...subscription,
        billing: {
          ...subscription.billing,
          paymentStatus: success ? 'succeeded' as PaymentStatus : 'failed' as PaymentStatus,
          lastPaymentFailed: !success,
        },
      };
      
      setSubscription(newState);
      localStorage.setItem('subscription', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to retry payment:', error);
      setSubscription({
        ...subscription,
        billing: {
          ...subscription.billing,
          paymentStatus: 'failed',
          lastPaymentFailed: true,
        },
      });
    }
  };

  return { cancelSubscription, retryPayment };
};