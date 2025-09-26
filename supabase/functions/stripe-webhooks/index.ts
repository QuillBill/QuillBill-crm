import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    // Log webhook event
    await supabase.from('webhooks').insert({
      event_type: event.type,
      event_id: event.id,
      payload: event,
      processed: false
    })

    // Handle different event types
    switch (event.type) {
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer, supabase)
        break
      
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer, supabase)
        break

      case 'invoice.created':
        await handleInvoiceCreated(event.data.object as Stripe.Invoice, supabase)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark webhook as processed
    await supabase
      .from('webhooks')
      .update({ processed: true })
      .eq('event_id', event.id)

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function handleCustomerCreated(customer: Stripe.Customer, supabase: any) {
  const { error } = await supabase.from('customers').insert({
    stripe_customer_id: customer.id,
    name: customer.name || customer.email,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    metadata: customer.metadata
  })
  
  if (error) console.error('Error creating customer:', error)
}

async function handleCustomerUpdated(customer: Stripe.Customer, supabase: any) {
  const { error } = await supabase
    .from('customers')
    .update({
      name: customer.name || customer.email,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      metadata: customer.metadata
    })
    .eq('stripe_customer_id', customer.id)
  
  if (error) console.error('Error updating customer:', error)
}

async function handleInvoiceCreated(invoice: Stripe.Invoice, supabase: any) {
  const { data: customer } = await supabase
    .from('customers')
    .select('id, user_id')
    .eq('stripe_customer_id', invoice.customer)
    .single()

  if (!customer) return

  const { error } = await supabase.from('invoices').insert({
    user_id: customer.user_id,
    customer_id: customer.id,
    stripe_invoice_id: invoice.id,
    invoice_number: invoice.number,
    status: invoice.status === 'paid' ? 'paid' : 'sent',
    currency: invoice.currency.toUpperCase(),
    subtotal: invoice.subtotal / 100,
    tax_amount: invoice.tax / 100,
    total_amount: invoice.total / 100,
    amount_due: invoice.amount_due / 100,
    due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
    hosted_invoice_url: invoice.hosted_invoice_url,
    pdf_url: invoice.invoice_pdf
  })

  if (error) console.error('Error creating invoice:', error)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  const { error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      amount_paid: invoice.amount_paid / 100
    })
    .eq('stripe_invoice_id', invoice.id)

  if (error) console.error('Error updating invoice payment:', error)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  const { error } = await supabase
    .from('invoices')
    .update({ status: 'overdue' })
    .eq('stripe_invoice_id', invoice.id)

  if (error) console.error('Error updating failed invoice:', error)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  const { data: customer } = await supabase
    .from('customers')
    .select('id, user_id')
    .eq('stripe_customer_id', subscription.customer)
    .single()

  if (!customer) return

  const { error } = await supabase.from('subscriptions').insert({
    user_id: customer.user_id,
    customer_id: customer.id,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    metadata: subscription.metadata
  })

  if (error) console.error('Error creating subscription:', error)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
      metadata: subscription.metadata
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) console.error('Error updating subscription:', error)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      ended_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) console.error('Error deleting subscription:', error)
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  const { data: customer } = await supabase
    .from('customers')
    .select('id, user_id')
    .eq('stripe_customer_id', paymentIntent.customer)
    .single()

  if (!customer) return

  const { error } = await supabase.from('payments').insert({
    user_id: customer.user_id,
    customer_id: customer.id,
    stripe_payment_id: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency.toUpperCase(),
    status: 'succeeded',
    payment_method: paymentIntent.payment_method_types[0],
    processed_at: new Date().toISOString(),
    metadata: paymentIntent.metadata
  })

  if (error) console.error('Error recording payment:', error)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  const { data: customer } = await supabase
    .from('customers')
    .select('id, user_id')
    .eq('stripe_customer_id', paymentIntent.customer)
    .single()

  if (!customer) return

  const { error } = await supabase.from('payments').insert({
    user_id: customer.user_id,
    customer_id: customer.id,
    stripe_payment_id: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency.toUpperCase(),
    status: 'failed',
    payment_method: paymentIntent.payment_method_types[0],
    failure_reason: paymentIntent.last_payment_error?.message,
    metadata: paymentIntent.metadata
  })

  if (error) console.error('Error recording failed payment:', error)
}