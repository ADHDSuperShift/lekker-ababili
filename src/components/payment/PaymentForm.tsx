import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CreditCard, Smartphone } from 'lucide-react';
import { TraditionalPayment } from './TraditionalPayment';

interface PaymentFormProps {
  plan: 'basic' | 'premium' | 'pro';
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

const PLAN_PRICES = {
  basic: 149.99,
  premium: 299.99,
  pro: 599.99
};

export const PaymentForm: React.FC<PaymentFormProps> = ({
  plan,
  onSuccess,
  onError
}) => {
  const [activeTab, setActiveTab] = useState('card');
  const amount = PLAN_PRICES[plan];

  const handleCardSuccess = (paymentId: string) => {
    onSuccess?.(paymentId);
  };

  const handleCardError = (error: string) => {
    onError?.(error);
  };

  const handleEFTPayment = async () => {
    // Simulate EFT payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess?.(`eft_${Date.now()}`);
    } catch (err) {
      onError?.('EFT payment failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Subscription</CardTitle>
          <p className="text-sm text-muted-foreground">
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - R{amount}/month
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger value="eft" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                EFT/Bank Transfer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="mt-6">
              <TraditionalPayment
                plan={plan}
                amount={amount}
                onSuccess={handleCardSuccess}
                onError={handleCardError}
              />
            </TabsContent>

            <TabsContent value="eft" className="mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">Bank Transfer Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer R{amount} to the account below:
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Bank:</span>
                      <span>Standard Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Account Name:</span>
                      <span>Lekker Ababili Pty Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Account Number:</span>
                      <span>123456789</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Branch Code:</span>
                      <span>051001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Reference:</span>
                      <span>{plan.toUpperCase()}-{Date.now()}</span>
                    </div>
                  </div>

                  <Button onClick={handleEFTPayment} className="w-full">
                    I've Made the Transfer
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};