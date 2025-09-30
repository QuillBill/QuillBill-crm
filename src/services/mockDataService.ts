// Mock data service for demo purposes

// Enhanced mock data with more realistic entries
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
      updated_at: '2024-01-15T00:00:00Z',
      subscriptions: 2
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
      updated_at: '2024-02-20T00:00:00Z',
      subscriptions: 1
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
      updated_at: '2024-01-08T00:00:00Z',
      subscriptions: 0
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
      updated_at: '2023-12-10T00:00:00Z',
      subscriptions: 3
    },
    {
      id: '5',
      user_id: 'demo-user',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 (555) 654-3210',
      company: 'Innovation Labs',
      status: 'active',
      total_revenue: 5670,
      currency: 'USD',
      created_at: '2023-11-05T00:00:00Z',
      updated_at: '2023-11-05T00:00:00Z',
      subscriptions: 2
    },
    {
      id: '6',
      user_id: 'demo-user',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 (555) 789-0123',
      company: 'Creative Agency',
      status: 'active',
      total_revenue: 4320,
      currency: 'USD',
      created_at: '2024-01-22T00:00:00Z',
      updated_at: '2024-01-22T00:00:00Z',
      subscriptions: 1
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
      quantity: 1,
      discount_percent: 0,
      tax_percent: 0,
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
      quantity: 1,
      discount_percent: 0,
      tax_percent: 0,
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
      quantity: 1,
      discount_percent: 0,
      tax_percent: 0,
      created_at: '2024-01-20T00:00:00Z'
    }
  ],

  invoices: [
    {
      id: '1',
      user_id: 'demo-user',
      customer_id: '1',
      subscription_id: '1',
      invoice_number: 'INV-000001',
      status: 'paid',
      currency: 'USD',
      subtotal: 99.00,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 99.00,
      amount_paid: 99.00,
      amount_due: 0,
      tax_percent: 0,
      discount_percent: 0,
      due_date: '2024-02-01T00:00:00Z',
      paid_at: '2024-01-28T00:00:00Z',
      sent_at: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-28T00:00:00Z',
      customer_name: 'John Doe',
      customer_email: 'john@example.com'
    },
    {
      id: '2',
      user_id: 'demo-user',
      customer_id: '2',
      subscription_id: '2',
      invoice_number: 'INV-000002',
      status: 'sent',
      currency: 'USD',
      subtotal: 199.00,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 199.00,
      amount_paid: 0,
      amount_due: 199.00,
      tax_percent: 0,
      discount_percent: 0,
      due_date: '2024-02-15T00:00:00Z',
      sent_at: '2024-01-15T00:00:00Z',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com'
    },
    {
      id: '3',
      user_id: 'demo-user',
      customer_id: '4',
      subscription_id: '3',
      invoice_number: 'INV-000003',
      status: 'overdue',
      currency: 'USD',
      subtotal: 299.00,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 299.00,
      amount_paid: 0,
      amount_due: 299.00,
      tax_percent: 0,
      discount_percent: 0,
      due_date: '2024-01-25T00:00:00Z',
      sent_at: '2024-01-10T00:00:00Z',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z',
      customer_name: 'Alice Brown',
      customer_email: 'alice@example.com'
    },
    {
      id: '4',
      user_id: 'demo-user',
      customer_id: '5',
      invoice_number: 'INV-000004',
      status: 'draft',
      currency: 'USD',
      subtotal: 450.00,
      tax_amount: 45.00,
      discount_amount: 0,
      total_amount: 495.00,
      amount_paid: 0,
      amount_due: 495.00,
      tax_percent: 10,
      discount_percent: 0,
      due_date: '2024-03-01T00:00:00Z',
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z',
      customer_name: 'Michael Chen',
      customer_email: 'michael@example.com'
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
      interval_count: 1,
      trial_period_days: 14,
      active: true,
      features: ['Up to 100 customers', 'Basic invoicing', 'Email support'],
      metadata: {},
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
      interval_count: 1,
      trial_period_days: 14,
      active: true,
      features: ['Up to 1000 customers', 'Advanced invoicing', 'Priority support', 'Analytics'],
      metadata: {},
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
      interval_count: 1,
      trial_period_days: 30,
      active: true,
      features: ['Unlimited customers', 'Custom invoicing', '24/7 support', 'Advanced analytics', 'API access'],
      metadata: {},
      created_at: '2024-01-01T00:00:00Z'
    }
  ]
};

// Performance optimization: Pre-process data for faster access
const processedData = {
  ...mockData,
  customers: mockData.customers.map(customer => ({
    ...customer,
    // Pre-calculate derived fields
    displayName: `${customer.name} (${customer.company})`,
    revenueFormatted: `$${customer.total_revenue.toLocaleString()}`,
    joinDate: new Date(customer.created_at).toLocaleDateString()
  })),
  invoices: mockData.invoices.map(invoice => ({
    ...invoice,
    // Pre-calculate derived fields
    totalFormatted: `$${invoice.total_amount.toFixed(2)}`,
    dueDateFormatted: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : null,
    createdDateFormatted: new Date(invoice.created_at).toLocaleDateString()
  }))
};
export const getMockData = (table: string) => {
  return processedData[table as keyof typeof processedData] || [];
};

// Add search functionality for better performance
export const searchMockData = (table: string, searchTerm: string) => {
  const data = getMockData(table);
  if (!searchTerm) return data;
  
  const term = searchTerm.toLowerCase();
  return data.filter((item: any) =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(term)
    )
  );
};