// Stripe configuration and utilities
export const STRIPE_CONFIG = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_example',
  priceIds: {
    pro: 'price_pro_monthly',
    premium: 'price_premium_monthly',
  },
};

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
}

export interface Subscription {
  id: string;
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  priceId: string;
}

export interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amountPaid: number;
  amountDue: number;
  currency: string;
  created: number;
  dueDate: number;
  hostedInvoiceUrl: string;
  invoicePdf: string;
}

// Mock API functions - replace with actual Stripe API calls
export const stripeApi = {
  createPaymentIntent: async (amount: number, currency: string = 'zar'): Promise<PaymentIntent> => {
    // Mock implementation - replace with actual Stripe API call
    return {
      id: 'pi_' + Math.random().toString(36).substr(2, 9),
      clientSecret: 'pi_' + Math.random().toString(36).substr(2, 9) + '_secret',
      status: 'requires_payment_method',
    };
  },

  createSubscription: async (priceId: string, customerId: string): Promise<Subscription> => {
    // Mock implementation
    return {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      status: 'active',
      currentPeriodStart: Date.now() / 1000,
      currentPeriodEnd: (Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      cancelAtPeriodEnd: false,
      priceId,
    };
  },

  cancelSubscription: async (subscriptionId: string): Promise<Subscription> => {
    // Mock implementation
    return {
      id: subscriptionId,
      status: 'canceled',
      currentPeriodStart: Date.now() / 1000,
      currentPeriodEnd: (Date.now() / 1000) + (30 * 24 * 60 * 60),
      cancelAtPeriodEnd: true,
      priceId: 'price_pro_monthly',
    };
  },

  getInvoices: async (customerId: string): Promise<Invoice[]> => {
    // Mock implementation
    return [
      {
        id: 'in_' + Math.random().toString(36).substr(2, 9),
        number: 'INV-2024-001',
        status: 'paid',
        amountPaid: 19900,
        amountDue: 0,
        currency: 'zar',
        created: Date.now() / 1000 - (30 * 24 * 60 * 60),
        dueDate: Date.now() / 1000,
        hostedInvoiceUrl: 'https://invoice.stripe.com/example',
        invoicePdf: 'https://invoice.stripe.com/example.pdf',
      },
    ];
  },
};