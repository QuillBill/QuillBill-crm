/*
  # Complete QuillBill Database Schema

  1. New Tables
    - `profiles` - User profiles and company information
    - `customers` - Customer management with billing details
    - `plans` - Subscription plans and pricing tiers
    - `subscriptions` - Active subscriptions with billing cycles
    - `invoices` - Invoice generation and tracking
    - `invoice_items` - Line items for invoices
    - `payments` - Payment tracking and history
    - `usage_records` - Usage-based billing tracking
    - `webhooks` - Webhook event logging
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Secure API access patterns

  3. Functions
    - Automated invoice generation
    - Subscription lifecycle management
    - Revenue calculations
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  website text,
  phone text,
  address jsonb,
  tax_id text,
  currency text DEFAULT 'USD',
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  interval text NOT NULL CHECK (interval IN ('month', 'year', 'week', 'day')),
  interval_count integer DEFAULT 1,
  trial_period_days integer DEFAULT 0,
  features jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  stripe_price_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  address jsonb,
  tax_id text,
  currency text DEFAULT 'USD',
  payment_method jsonb,
  billing_address jsonb,
  shipping_address jsonb,
  notes text,
  tags text[],
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  total_revenue decimal(10,2) DEFAULT 0,
  stripe_customer_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES plans(id) ON DELETE SET NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'paused')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  trial_start timestamptz,
  trial_end timestamptz,
  canceled_at timestamptz,
  ended_at timestamptz,
  quantity integer DEFAULT 1,
  unit_amount decimal(10,2),
  currency text DEFAULT 'USD',
  discount_percent decimal(5,2) DEFAULT 0,
  tax_percent decimal(5,2) DEFAULT 0,
  stripe_subscription_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'canceled', 'refunded')),
  currency text DEFAULT 'USD',
  subtotal decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  amount_paid decimal(10,2) DEFAULT 0,
  amount_due decimal(10,2) DEFAULT 0,
  tax_percent decimal(5,2) DEFAULT 0,
  discount_percent decimal(5,2) DEFAULT 0,
  due_date timestamptz,
  paid_at timestamptz,
  sent_at timestamptz,
  notes text,
  terms text,
  footer text,
  stripe_invoice_id text,
  pdf_url text,
  hosted_invoice_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity decimal(10,2) DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  amount decimal(10,2) NOT NULL,
  tax_percent decimal(5,2) DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'refunded')),
  payment_method text,
  payment_intent_id text,
  stripe_payment_id text,
  failure_reason text,
  refunded_amount decimal(10,2) DEFAULT 0,
  fees decimal(10,2) DEFAULT 0,
  net_amount decimal(10,2),
  processed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Usage records table (for usage-based billing)
CREATE TABLE IF NOT EXISTS usage_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  quantity decimal(10,2) NOT NULL,
  unit_price decimal(10,2),
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_id text NOT NULL,
  processed boolean DEFAULT false,
  attempts integer DEFAULT 0,
  last_attempt timestamptz,
  payload jsonb NOT NULL,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  action_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can manage own plans" ON plans
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own customers" ON customers
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscriptions" ON subscriptions
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own invoices" ON invoices
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view invoice items for own invoices" ON invoice_items
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
  );

CREATE POLICY "Users can manage invoice items for own invoices" ON invoice_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
  );

CREATE POLICY "Users can manage own payments" ON payments
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view usage records for own subscriptions" ON usage_records
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.id = usage_records.subscription_id AND subscriptions.user_id = auth.uid())
  );

CREATE POLICY "Users can manage own webhooks" ON webhooks
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Functions for automated processes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  invoice_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-(\d+)') AS INTEGER)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE user_id = auth.uid();
  
  invoice_number := 'INV-' || LPAD(next_number::TEXT, 6, '0');
  RETURN invoice_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_invoice_totals(invoice_uuid uuid)
RETURNS void AS $$
DECLARE
  subtotal_amount decimal(10,2);
  tax_amount decimal(10,2);
  total_amount decimal(10,2);
  invoice_tax_percent decimal(5,2);
  invoice_discount_amount decimal(10,2);
BEGIN
  -- Get invoice tax percent and discount
  SELECT tax_percent, discount_amount INTO invoice_tax_percent, invoice_discount_amount
  FROM invoices WHERE id = invoice_uuid;
  
  -- Calculate subtotal
  SELECT COALESCE(SUM(amount), 0) INTO subtotal_amount
  FROM invoice_items WHERE invoice_id = invoice_uuid;
  
  -- Apply discount
  subtotal_amount := subtotal_amount - COALESCE(invoice_discount_amount, 0);
  
  -- Calculate tax
  tax_amount := subtotal_amount * (COALESCE(invoice_tax_percent, 0) / 100);
  
  -- Calculate total
  total_amount := subtotal_amount + tax_amount;
  
  -- Update invoice
  UPDATE invoices SET
    subtotal = subtotal_amount,
    tax_amount = tax_amount,
    total_amount = total_amount,
    amount_due = total_amount - COALESCE(amount_paid, 0)
  WHERE id = invoice_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-calculate invoice totals
CREATE OR REPLACE FUNCTION trigger_calculate_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_invoice_totals(COALESCE(NEW.invoice_id, OLD.invoice_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_invoice_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON invoice_items
  FOR EACH ROW EXECUTE FUNCTION trigger_calculate_invoice_totals();