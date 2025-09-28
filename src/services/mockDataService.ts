// Mock data service for demo purposes
export const mockData = {
  customers: [
    {
      id: '1',
      user_id: 'demo-user',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc',
      status: 'active',
      total_revenue: 2450,
      currency: 'USD',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      user_id: 'demo-user',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      company: 'Design Studio LLC',
      status: 'active',
      total_revenue: 1890,
      currency: 'USD',
      created_at: '2024-02-20T00:00:00Z',
      updated_at: '2024-02-20T00:00:00Z'
    },
    {
      id: '3',
      user_id: 'demo-user',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 (555) 456-7890',
      company: 'Marketing Pro',
      status: 'inactive',
      total_revenue: 750,
      currency: 'USD',
      created_at: '2024-01-08T00:00:00Z',
      updated_at: '2024-01-08T00:00:00Z'
    },
    {
      id: '4',
      user_id: 'demo-user',
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+1 (555) 321-0987',
      company: 'Consulting Group',
      status: 'active',
      total_revenue: 3200,
      currency: 'USD',
      created_at: '2023-12-10T00:00:00Z',
      updated_at: '2023-12-10T00:00:00Z'
    }
  ],

  subscriptions: [
    {
      id: '1',
      user_id: 'demo-user',
      customer_id: '1',
      plan_id: '1',
      status: 'active',
      current_period_start: '2024-01-01T00:00:00Z',
      current_period_end: '2024-02-01T00:00:00Z',
      unit_amount: 99.00,
      currency: 'USD',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      user_id: 'demo-user',
      customer_id: '2',
      plan_id: '2',
      status: 'active',
      current_period_start: '2024-01-15T00:00:00Z',
      current_period_end: '2024-02-15T00:00:00Z',
      unit_amount: 199.00,
      currency: 'USD',
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      user_id: 'demo-user',
      customer_id: '4',
      plan_id: '3',
      status: 'trialing',
      current_period_start: '2024-01-20T00:00:00Z',
      current_period_end: '2024-02-20T00:00:00Z',
      trial_end: '2024-02-05T00:00:00Z',
      unit_amount: 299.00,
      currency: 'USD',
      created_at: '2024-01-20T00:00:00Z'
    }
  ],

  invoices: [
    {
      id: '1',
      user_id: 'demo-user',
      customer_id: '1',
      invoice_number: 'INV-000001',
      status: 'paid',
      total_amount: 99.00,
      amount_paid: 99.00,
      amount_due: 0,
      currency: 'USD',
      due_date: '2024-02-01T00:00:00Z',
      paid_at: '2024-01-28T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      user_id: 'demo-user',
      customer_id: '2',
      invoice_number: 'INV-000002',
      status: 'sent',
      total_amount: 199.00,
      amount_paid: 0,
      amount_due: 199.00,
      currency: 'USD',
      due_date: '2024-02-15T00:00:00Z',
      sent_at: '2024-01-15T00:00:00Z',
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      user_id: 'demo-user',
      customer_id: '4',
      invoice_number: 'INV-000003',
      status: 'overdue',
      total_amount: 299.00,
      amount_paid: 0,
      amount_due: 299.00,
      currency: 'USD',
      due_date: '2024-01-25T00:00:00Z',
      created_at: '2024-01-10T00:00:00Z'
    }
  ],

  plans: [
    {
      id: '1',
      user_id: 'demo-user',
      name: 'Starter',
      description: 'Perfect for small businesses',
      price: 99.00,
      currency: 'USD',
      interval: 'month',
      active: true,
      features: ['Up to 100 customers', 'Basic invoicing', 'Email support'],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      user_id: 'demo-user',
      name: 'Professional',
      description: 'For growing businesses',
      price: 199.00,
      currency: 'USD',
      interval: 'month',
      active: true,
      features: ['Up to 1000 customers', 'Advanced invoicing', 'Priority support', 'Analytics'],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      user_id: 'demo-user',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 299.00,
      currency: 'USD',
      interval: 'month',
      active: true,
      features: ['Unlimited customers', 'Custom invoicing', '24/7 support', 'Advanced analytics', 'API access'],
      created_at: '2024-01-01T00:00:00Z'
    }
  ]
}

export const getMockData = (table: string) => {
  return mockData[table as keyof typeof mockData] || []
}