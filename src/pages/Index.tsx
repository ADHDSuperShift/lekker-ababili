import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import AppLayout from '../components/AppLayout';

const Index = () => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppProvider>
          <AppLayout />
        </AppProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default Index;