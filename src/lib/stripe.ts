import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Stripe API functions
export const stripeAPI = {
  // Create customer
  async createCustomer(customerData: {
    name: string;
    email: string;
    phone?: string;
    address?: any;
    metadata?: any;
  }) {
    const response = await fetch('/api/stripe/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    return response.json();
  },

  // Create subscription
  async createSubscription(subscriptionData: {
    customer_id: string;
    price_id: string;
    trial_period_days?: number;
    metadata?: any;
  }) {
    const response = await fetch('/api/stripe/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    });
    return response.json();
  },

  // Create invoice
  async createInvoice(invoiceData: {
    customer_id: string;
    items: Array<{
      description: string;
      quantity: number;
      unit_amount: number;
    }>;
    due_date?: string;
    metadata?: any;
  }) {
    const response = await fetch('/api/stripe/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });
    return response.json();
  },

  // Create payment intent
  async createPaymentIntent(paymentData: {
    amount: number;
    currency: string;
    customer_id?: string;
    metadata?: any;
  }) {
    const response = await fetch('/api/stripe/payment-intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  // Get customer portal URL
  async createCustomerPortal(customerId: string, returnUrl: string) {
    const response = await fetch('/api/stripe/customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer_id: customerId, return_url: returnUrl }),
    });
    return response.json();
  }
};