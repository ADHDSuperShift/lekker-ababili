import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface SubscriptionState {
  plan: 'free' | 'basic' | 'premium' | 'pro';
  isActive: boolean;
  languages: number | 'all';
  hasWordbook: boolean;
  hasChatbot: boolean;
  hasOfflinePacks: boolean;
  hasFamilyAccounts: boolean;
  hasAdvancedTutor: boolean;
}

interface SubscriptionFeatures {
  translations: number;
  voiceMinutes: number;
  languageCount: number;
  hasOfflineMode: boolean;
  hasAdvancedAR: boolean;
  hasPersonalTutor: boolean;
  hasWordbook: boolean;
  hasGroupChats: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface SubscriptionBilling {
  customerId?: string;
  subscriptionId?: string;
  nextBillingDate?: Date;
  lastBillingDate?: Date;
  amount?: number;
  paymentStatus: 'none' | 'pending' | 'succeeded' | 'failed';
  lastPaymentFailed: boolean;
}

interface Subscription {
  plan: SubscriptionState['plan'];
  trialDaysLeft: number;
  isTrialActive: boolean;
  features: SubscriptionFeatures;
  usage: {
    translations: number;
    speechMinutes: number;
    ocrScans: number;
  };
  billing: SubscriptionBilling;
}

interface SubscriptionContextType {
  subscription: Subscription;
  canUseFeature: (feature: keyof SubscriptionFeatures) => boolean;
  upgradeToPro: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const getFeatures = (plan: SubscriptionState['plan']): SubscriptionFeatures => {
  switch (plan) {
    case 'free':
      return {
        translations: 10,
        voiceMinutes: 5,
        languageCount: 1,
        hasOfflineMode: false,
        hasAdvancedAR: false,
        hasPersonalTutor: false,
        hasWordbook: false,
        hasGroupChats: false,
        priority: 'low',
      };
    case 'basic':
      return {
        translations: 100,
        voiceMinutes: 30,
        languageCount: 2,
        hasOfflineMode: true,
        hasAdvancedAR: false,
        hasPersonalTutor: false,
        hasWordbook: true,
        hasGroupChats: false,
        priority: 'medium',
      };
    case 'pro':
      return {
        translations: 1000,
        voiceMinutes: 120,
        languageCount: 5,
        hasOfflineMode: true,
        hasAdvancedAR: true,
        hasPersonalTutor: true,
        hasWordbook: true,
        hasGroupChats: true,
        priority: 'high',
      };
    case 'premium':
      return {
        translations: -1, // unlimited
        voiceMinutes: -1, // unlimited
        languageCount: -1, // unlimited
        hasOfflineMode: true,
        hasAdvancedAR: true,
        hasPersonalTutor: true,
        hasWordbook: true,
        hasGroupChats: true,
        priority: 'high',
      };
    default:
      return getFeatures('free');
  }
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription>({
    plan: 'free',
    trialDaysLeft: 7,
    isTrialActive: true,
    features: getFeatures('free'),
    usage: {
      translations: 0,
      speechMinutes: 0,
      ocrScans: 0,
    },
    billing: {
      paymentStatus: 'none',
      lastPaymentFailed: false,
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem('subscription');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubscription({
          ...parsed,
          features: getFeatures(parsed.plan),
        });
      } catch (error) {
        console.error('Failed to load subscription from localStorage:', error);
      }
    }
  }, []);

  const upgradeToPro = async () => {
    try {
      // TODO: Implement actual payment processing
      const newState = {
        ...subscription,
        plan: 'pro' as const,
        features: getFeatures('pro'),
        isTrialActive: false,
        billing: {
          subscriptionId: 'temp_sub_' + Date.now(),
          customerId: 'cus_example123',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentStatus: 'succeeded' as const,
          lastPaymentFailed: false,
        },
      };
      setSubscription(newState);
      localStorage.setItem('subscription', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to upgrade to Pro:', error);
    }
  };

  const upgradeToPremium = async () => {
    try {
      // TODO: Implement actual payment processing
      const newState = {
        ...subscription,
        plan: 'premium' as const,
        features: getFeatures('premium'),
        isTrialActive: false,
        billing: {
          subscriptionId: 'temp_sub_' + Date.now(),
          customerId: 'cus_example123',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentStatus: 'succeeded' as const,
          lastPaymentFailed: false,
        },
      };
      setSubscription(newState);
      localStorage.setItem('subscription', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to upgrade to Premium:', error);
    }
  };

  const cancelSubscription = async () => {
    try {
      // TODO: Implement actual cancellation
      const newState = {
        ...subscription,
        plan: 'free' as const,
        features: getFeatures('free'),
        isTrialActive: false,
        billing: {
          paymentStatus: 'none' as const,
          lastPaymentFailed: false,
        },
      };
      setSubscription(newState);
      localStorage.setItem('subscription', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const canUseFeature = (feature: keyof SubscriptionFeatures): boolean => {
    const featureValue = subscription.features[feature];
    if (typeof featureValue === 'number') {
      return featureValue === -1 || featureValue > 0; // -1 means unlimited
    }
    return Boolean(featureValue);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        canUseFeature,
        upgradeToPro,
        upgradeToPremium,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
