// Stripe integration with working demo keys
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key_for_development';

// Mock Stripe for demo purposes
export const stripePromise = Promise.resolve({
  confirmPayment: async () => ({ error: null, paymentIntent: { status: 'succeeded' } }),
  createPaymentMethod: async () => ({ error: null, paymentMethod: { id: 'pm_demo' } }),
  confirmCardPayment: async () => ({ error: null, paymentIntent: { status: 'succeeded' } })
});

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
    // Mock response for demo
    return {
      id: 'cus_demo_' + Date.now(),
      email: customerData.email,
      name: customerData.name,
      created: Math.floor(Date.now() / 1000)
    };
  },

  // Create subscription
  async createSubscription(subscriptionData: {
    customer_id: string;
    price_id: string;
    trial_period_days?: number;
    metadata?: any;
  }) {
    // Mock response for demo
    return {
      id: 'sub_demo_' + Date.now(),
      customer: subscriptionData.customer_id,
      status: 'active',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000)
    };
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
    // Mock response for demo
    const total = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unit_amount), 0);
    return {
      id: 'in_demo_' + Date.now(),
      customer: invoiceData.customer_id,
      amount_due: total,
      amount_paid: 0,
      status: 'open',
      hosted_invoice_url: 'https://invoice.stripe.com/demo'
    };
  },

  // Create payment intent
  async createPaymentIntent(paymentData: {
    amount: number;
    currency: string;
    customer_id?: string;
    metadata?: any;
  }) {
    // Mock response for demo
    return {
      id: 'pi_demo_' + Date.now(),
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'requires_payment_method',
      client_secret: 'pi_demo_secret_' + Date.now()
    };
  },

  // Get customer portal URL
  async createCustomerPortal(customerId: string, returnUrl: string) {
    // Mock response for demo
    return {
      url: 'https://billing.stripe.com/demo/customer-portal'
    };
  }
};