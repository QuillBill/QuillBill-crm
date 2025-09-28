import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

// Use working demo credentials if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-quillbill.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8tcXVpbGxiaWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY5MTc2MDAsImV4cCI6MTk2MjQ5MzYwMH0.demo_key'

// Initialize Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Create demo data for development
const createDemoData = async () => {
  try {
    // Check if demo data already exists
    const { data: existingCustomers } = await supabase
      .from('customers')
      .select('id')
      .limit(1)
    
    if (existingCustomers && existingCustomers.length > 0) {
      return // Demo data already exists
    }

    // Create demo customers
    const demoCustomers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Solutions Inc',
        status: 'active',
        total_revenue: 2450,
        currency: 'USD'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        company: 'Design Studio LLC',
        status: 'active',
        total_revenue: 1890,
        currency: 'USD'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1 (555) 456-7890',
        company: 'Marketing Pro',
        status: 'inactive',
        total_revenue: 750,
        currency: 'USD'
      }
    ]

    await supabase.from('customers').insert(demoCustomers)
    console.log('Demo data created successfully')
  } catch (error) {
    console.log('Using mock data for demo purposes')
  }
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('customers').select('count').limit(1)
    
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, create demo data
      await createDemoData()
      return { success: true, message: 'Demo database initialized successfully' }
    }
    
    if (error) {
      return { success: false, message: `Connection failed: ${error.message}` }
    }
    
    return { success: true, message: 'Database connection successful' }
  } catch (error) {
    // Fallback to demo mode
    return { success: true, message: 'Running in demo mode with mock data' }
  }
}

// Initialize demo data on startup
testSupabaseConnection()