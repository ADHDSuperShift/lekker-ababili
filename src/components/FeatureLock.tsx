import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import UpgradePrompt from './subscription/UpgradePrompt';

interface FeatureLockProps {
  feature: keyof import('../contexts/SubscriptionContext').SubscriptionFeatures;
  requiredPlan: 'pro' | 'premium';
  featureName: string;
  children: React.ReactNode;
}

const FeatureLock: React.FC<FeatureLockProps> = ({
  feature,
  requiredPlan,
  featureName,
  children,
}) => {
  const { canUseFeature } = useSubscription();

  if (!canUseFeature(feature)) {
    return (
      <UpgradePrompt
        feature={featureName}
        requiredPlan={requiredPlan}
      />
    );
  }

  return <>{children}</>;
};

export default FeatureLock;