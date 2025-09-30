export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: any;
  tax_id?: string;
  currency: string;
  payment_method?: any;
  billing_address?: any;
  shipping_address?: any;
  notes?: string;
  tags?: string[];
  status: string;
  total_revenue: number;
  stripe_customer_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  subscriptions?: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  customer_id: string;
  subscription_id?: string;
  invoice_number: string;
  status: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  tax_percent: number;
  discount_percent: number;
  due_date?: string;
  paid_at?: string;
  sent_at?: string;
  notes?: string;
  terms?: string;
  footer?: string;
  stripe_invoice_id?: string;
  pdf_url?: string;
  hosted_invoice_url?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  customer_id: string;
  plan_id?: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  trial_start?: string;
  trial_end?: string;
  canceled_at?: string;
  ended_at?: string;
  quantity: number;
  unit_amount?: number;
  currency: string;
  discount_percent: number;
  tax_percent: number;
  stripe_subscription_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: string;
  interval_count: number;
  trial_period_days: number;
  features?: any;
  metadata?: any;
  active: boolean;
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
}