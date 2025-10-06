import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, X } from 'lucide-react';
import { PaymentForm } from './PaymentForm';
import { SubscriptionPlan } from '../../contexts/SubscriptionContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onSuccess: () => void;
}

const planDetails = {
  pro: {
    name: 'Pro',
    price: 19900, // R199.00 in cents
    features: [
      'All languages unlocked',
      'Unlimited text translations',
      'Generous speech + OCR',
      'Wordbook + flashcards + streaks',
      'AI Chatbot',
      'Offline packs',
    ],
  },
  premium: {
    name: 'Premium',
    price: 29900, // R299.00 in cents
    features: [
      'Everything in Pro',
      'Family accounts (up to 5 members)',
      'Advanced AI tutor',
      'Higher OCR quota',
      'Priority support',
      'Early access to new features',
    ],
  },
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess,
}) => {
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'success'>('details');
  const [error, setError] = useState('');

  const details = planDetails[plan as keyof typeof planDetails];

  const handlePaymentSuccess = () => {
    setPaymentStep('success');
    setTimeout(() => {
      onSuccess();
      onClose();
      setPaymentStep('details');
    }, 2000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleClose = () => {
    onClose();
    setPaymentStep('details');
    setError('');
  };

  if (!details) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Subscribe to {details.name}
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {paymentStep === 'details' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">R{details.price / 100}</div>
              <div className="text-muted-foreground">per month</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">What's included:</h4>
              <ul className="space-y-1">
                {details.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Alert>
              <AlertDescription>
                7-day free trial included. Cancel anytime during the trial period.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => setPaymentStep('payment')}
              className="w-full"
            >
              Start Free Trial
            </Button>
          </div>
        )}

        {paymentStep === 'payment' && (
          <PaymentForm
            amount={details.price}
            currency="ZAR"
            planName={details.name}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}

        {paymentStep === 'success' && (
          <div className="text-center space-y-4 py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Payment Successful!</h3>
              <p className="text-muted-foreground">
                Welcome to {details.name}! Your subscription is now active.
              </p>
            </div>
          </div>
        )}

        {error && paymentStep === 'payment' && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};