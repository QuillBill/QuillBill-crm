export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          company_name: string | null
          email: string
          full_name: string | null
          avatar_url: string | null
          website: string | null
          phone: string | null
          address: any | null
          tax_id: string | null
          currency: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name?: string | null
          email: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          phone?: string | null
          address?: any | null
          tax_id?: string | null
          currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string | null
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          phone?: string | null
          address?: any | null
          tax_id?: string | null
          currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          address: any | null
          tax_id: string | null
          currency: string
          payment_method: any | null
          billing_address: any | null
          shipping_address: any | null
          notes: string | null
          tags: string[] | null
          status: string
          total_revenue: number
          stripe_customer_id: string | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          address?: any | null
          tax_id?: string | null
          currency?: string
          payment_method?: any | null
          billing_address?: any | null
          shipping_address?: any | null
          notes?: string | null
          tags?: string[] | null
          status?: string
          total_revenue?: number
          stripe_customer_id?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          address?: any | null
          tax_id?: string | null
          currency?: string
          payment_method?: any | null
          billing_address?: any | null
          shipping_address?: any | null
          notes?: string | null
          tags?: string[] | null
          status?: string
          total_revenue?: number
          stripe_customer_id?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          plan_id: string | null
          status: string
          current_period_start: string
          current_period_end: string
          trial_start: string | null
          trial_end: string | null
          canceled_at: string | null
          ended_at: string | null
          quantity: number
          unit_amount: number | null
          currency: string
          discount_percent: number
          tax_percent: number
          stripe_subscription_id: string | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id: string
          plan_id?: string | null
          status?: string
          current_period_start: string
          current_period_end: string
          trial_start?: string | null
          trial_end?: string | null
          canceled_at?: string | null
          ended_at?: string | null
          quantity?: number
          unit_amount?: number | null
          currency?: string
          discount_percent?: number
          tax_percent?: number
          stripe_subscription_id?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string
          plan_id?: string | null
          status?: string
          current_period_start?: string
          current_period_end?: string
          trial_start?: string | null
          trial_end?: string | null
          canceled_at?: string | null
          ended_at?: string | null
          quantity?: number
          unit_amount?: number | null
          currency?: string
          discount_percent?: number
          tax_percent?: number
          stripe_subscription_id?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          subscription_id: string | null
          invoice_number: string
          status: string
          currency: string
          subtotal: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          amount_paid: number
          amount_due: number
          tax_percent: number
          discount_percent: number
          due_date: string | null
          paid_at: string | null
          sent_at: string | null
          notes: string | null
          terms: string | null
          footer: string | null
          stripe_invoice_id: string | null
          pdf_url: string | null
          hosted_invoice_url: string | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id: string
          subscription_id?: string | null
          invoice_number: string
          status?: string
          currency?: string
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          amount_paid?: number
          amount_due?: number
          tax_percent?: number
          discount_percent?: number
          due_date?: string | null
          paid_at?: string | null
          sent_at?: string | null
          notes?: string | null
          terms?: string | null
          footer?: string | null
          stripe_invoice_id?: string | null
          pdf_url?: string | null
          hosted_invoice_url?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string
          subscription_id?: string | null
          invoice_number?: string
          status?: string
          currency?: string
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          amount_paid?: number
          amount_due?: number
          tax_percent?: number
          discount_percent?: number
          due_date?: string | null
          paid_at?: string | null
          sent_at?: string | null
          notes?: string | null
          terms?: string | null
          footer?: string | null
          stripe_invoice_id?: string | null
          pdf_url?: string | null
          hosted_invoice_url?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          price: number
          currency: string
          interval: string
          interval_count: number
          trial_period_days: number
          features: any | null
          metadata: any | null
          active: boolean
          stripe_price_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          price?: number
          currency?: string
          interval: string
          interval_count?: number
          trial_period_days?: number
          features?: any | null
          metadata?: any | null
          active?: boolean
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          interval?: string
          interval_count?: number
          trial_period_days?: number
          features?: any | null
          metadata?: any | null
          active?: boolean
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      calculate_invoice_totals: {
        Args: {
          invoice_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}