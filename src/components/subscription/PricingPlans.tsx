import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, Star } from 'lucide-react';
import { PaymentForm } from '../payment/PaymentForm';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 149.99,
    description: 'Perfect for beginners',
    features: [
      'Basic lessons',
      'Voice recognition',
      'Progress tracking',
      'Mobile app access'
    ],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299.99,
    description: 'Most popular choice',
    features: [
      'All Basic features',
      'AR translation',
      'AI chat tutor',
      'Cultural insights',
      'Offline mode',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 599.99,
    description: 'For serious learners',
    features: [
      'All Premium features',
      'Advanced analytics',
      'Custom lesson plans',
      'One-on-one tutoring',
      'Certificate program',
      '24/7 support'
    ],
    popular: false
  }
];

export const PricingPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    setShowPayment(false);
    // Handle successful payment (update subscription, show success message, etc.)
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // Handle payment error (show error message, etc.)
  };

  if (showPayment && selectedPlan) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowPayment(false)}
            className="mb-4"
          >
            ← Back to Plans
          </Button>
        </div>
        <PaymentForm
          plan={selectedPlan as 'basic' | 'premium' | 'pro'}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600">
          Unlock the full power of AI-driven Afrikaans learning
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                R{plan.price}
                <span className="text-sm font-normal text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(plan.id)}
              >
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>All plans include a 7-day free trial. Cancel anytime.</p>
        <p className="mt-2">
          Need help choosing? <a href="#" className="text-blue-600 hover:underline">Contact our team</a>
        </p>
      </div>
    </div>
  );
};