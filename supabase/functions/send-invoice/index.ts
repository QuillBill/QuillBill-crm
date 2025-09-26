import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  invoiceId: string
  recipientEmail?: string
  subject?: string
  message?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { invoiceId, recipientEmail, subject, message }: EmailRequest = await req.json()

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        customers (name, email, company),
        profiles (company_name, email, full_name),
        invoice_items (*)
      `)
      .eq('id', invoiceId)
      .single()

    if (invoiceError || !invoice) {
      throw new Error('Invoice not found')
    }

    const recipientEmailAddress = recipientEmail || invoice.customers.email
    const emailSubject = subject || `Invoice ${invoice.invoice_number} from ${invoice.profiles.company_name || invoice.profiles.full_name}`

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml(invoice)

    // Send email using your preferred email service
    // This is a placeholder - you would integrate with your email service
    const emailData = {
      to: recipientEmailAddress,
      from: invoice.profiles.email,
      subject: emailSubject,
      html: invoiceHtml,
      text: message || `Please find attached your invoice ${invoice.invoice_number}.`
    }

    // Update invoice status to sent
    await supabase
      .from('invoices')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', invoiceId)

    // Create notification
    await supabase.from('notifications').insert({
      user_id: invoice.user_id,
      title: 'Invoice Sent',
      message: `Invoice ${invoice.invoice_number} has been sent to ${recipientEmailAddress}`,
      type: 'success'
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invoice sent successfully',
        emailData 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Send invoice error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

function generateInvoiceHtml(invoice: any): string {
  const items = invoice.invoice_items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.unit_price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.amount.toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoice_number}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .invoice-header { background: #f8f9fa; padding: 20px; margin-bottom: 30px; }
        .invoice-title { font-size: 28px; font-weight: bold; color: #2563eb; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info, .customer-info { flex: 1; }
        .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .invoice-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
        .invoice-summary { text-align: right; }
        .total-row { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="invoice-title">INVOICE</div>
        <div>Invoice #${invoice.invoice_number}</div>
        <div>Date: ${new Date(invoice.created_at).toLocaleDateString()}</div>
        ${invoice.due_date ? `<div>Due Date: ${new Date(invoice.due_date).toLocaleDateString()}</div>` : ''}
      </div>

      <div class="invoice-details">
        <div class="company-info">
          <h3>From:</h3>
          <div><strong>${invoice.profiles.company_name || invoice.profiles.full_name}</strong></div>
          <div>${invoice.profiles.email}</div>
        </div>
        <div class="customer-info">
          <h3>To:</h3>
          <div><strong>${invoice.customers.name}</strong></div>
          ${invoice.customers.company ? `<div>${invoice.customers.company}</div>` : ''}
          <div>${invoice.customers.email}</div>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Quantity</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items}
        </tbody>
      </table>

      <div class="invoice-summary">
        <div>Subtotal: $${invoice.subtotal.toFixed(2)}</div>
        ${invoice.discount_amount > 0 ? `<div>Discount: -$${invoice.discount_amount.toFixed(2)}</div>` : ''}
        ${invoice.tax_amount > 0 ? `<div>Tax: $${invoice.tax_amount.toFixed(2)}</div>` : ''}
        <div class="total-row">Total: $${invoice.total_amount.toFixed(2)}</div>
        <div>Amount Due: $${invoice.amount_due.toFixed(2)}</div>
      </div>

      ${invoice.notes ? `<div style="margin-top: 30px;"><strong>Notes:</strong><br>${invoice.notes}</div>` : ''}
      ${invoice.terms ? `<div style="margin-top: 20px;"><strong>Terms:</strong><br>${invoice.terms}</div>` : ''}
    </body>
    </html>
  `
}