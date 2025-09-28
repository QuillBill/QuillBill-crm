import { supabase } from '../lib/supabase';
import { emailService } from './emailService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface InvoiceData {
  customer_id: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_percent?: number;
  }>;
  due_date?: string;
  notes?: string;
  terms?: string;
  tax_percent?: number;
  discount_amount?: number;
}

export const invoiceService = {
  // Create new invoice
  async createInvoice(invoiceData: InvoiceData) {
    try {
      // Mock invoice creation for demo
      const invoiceNumber = 'INV-' + String(Date.now()).slice(-6);
      const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const taxAmount = subtotal * ((invoiceData.tax_percent || 0) / 100);
      const total = subtotal + taxAmount - (invoiceData.discount_amount || 0);

      const mockInvoice = {
        id: 'inv_demo_' + Date.now(),
        invoice_number: invoiceNumber,
        customer_id: invoiceData.customer_id,
        status: 'draft',
        subtotal: subtotal,
        tax_amount: taxAmount,
        discount_amount: invoiceData.discount_amount || 0,
        total_amount: total,
        amount_due: total,
        currency: 'USD',
        due_date: invoiceData.due_date,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        created_at: new Date().toISOString()
      };

      console.log('📄 Invoice created (demo mode):', mockInvoice);
      
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return mockInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      // Return mock data even on error for demo
      return {
        id: 'inv_demo_error',
        invoice_number: 'INV-ERROR',
        status: 'draft'
      };
    }
  },

  // Send invoice via email
  async sendInvoice(invoiceId: string, recipientEmail?: string, customMessage?: string) {
    try {
      const result = await emailService.sendInvoice(invoiceId, recipientEmail, customMessage);
      return result;
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
    }
  },

  // Generate PDF invoice
  async generateInvoicePDF(invoiceId: string): Promise<Blob> {
    try {
      // Mock invoice data for PDF generation
      const mockInvoice = {
        invoice_number: 'INV-' + invoiceId.slice(-6),
        created_at: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        subtotal: 199.00,
        tax_amount: 19.90,
        discount_amount: 0,
        total_amount: 218.90,
        amount_due: 218.90,
        customers: {
          name: 'Demo Customer',
          email: 'demo@example.com',
          company: 'Demo Company Inc'
        },
        profiles: {
          company_name: 'QuillBill Demo',
          full_name: 'Demo User',
          email: 'demo@quillbill.com'
        },
        invoice_items: [
          {
            description: 'Professional Plan Subscription',
            quantity: 1,
            unit_price: 199.00,
            amount: 199.00
          }
        ]
      };

      console.log('📄 Generating PDF for invoice:', invoiceId);

      // Create HTML content for PDF
      const htmlContent = this.generateInvoiceHTML(mockInvoice);

      // Create a temporary div to render the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      document.body.appendChild(tempDiv);

      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Return mock PDF blob
      const mockPdfContent = 'Mock PDF content for demo purposes';
      return new Blob([mockPdfContent], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Return empty blob for demo
      return new Blob(['Demo PDF'], { type: 'application/pdf' });
    }
  },

  // Mark invoice as paid
  async markAsPaid(invoiceId: string, paymentAmount?: number) {
    try {
      console.log('💰 Marking invoice as paid (demo mode):', invoiceId, paymentAmount);
      
      // Simulate database update
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        id: invoiceId,
        status: 'paid',
        paid_at: new Date().toISOString(),
        amount_paid: paymentAmount
      };
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      return { id: invoiceId, status: 'paid' };
    }
  },

  // Cancel invoice
  async cancelInvoice(invoiceId: string) {
    try {
      console.log('❌ Canceling invoice (demo mode):', invoiceId);
      
      // Simulate database update
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        id: invoiceId,
        status: 'canceled'
      };
    } catch (error) {
      console.error('Error canceling invoice:', error);
      return { id: invoiceId, status: 'canceled' };
    }
  },

  // Generate invoice HTML for PDF
  generateInvoiceHTML(invoice: any): string {
    const items = invoice.invoice_items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.description}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.unit_price.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.amount.toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
        <div style="background: #f8f9fa; padding: 30px; margin-bottom: 40px; border-radius: 8px;">
          <h1 style="font-size: 36px; font-weight: bold; color: #2563eb; margin: 0;">INVOICE</h1>
          <div style="margin-top: 10px; font-size: 16px;">
            <div><strong>Invoice #${invoice.invoice_number}</strong></div>
            <div>Date: ${new Date(invoice.created_at).toLocaleDateString()}</div>
            ${invoice.due_date ? `<div>Due Date: ${new Date(invoice.due_date).toLocaleDateString()}</div>` : ''}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div style="flex: 1;">
            <h3 style="color: #374151; margin-bottom: 10px;">From:</h3>
            <div style="font-weight: bold; font-size: 18px;">${invoice.profiles.company_name || invoice.profiles.full_name}</div>
            <div>${invoice.profiles.email}</div>
            ${invoice.profiles.address ? `<div>${JSON.stringify(invoice.profiles.address)}</div>` : ''}
          </div>
          <div style="flex: 1;">
            <h3 style="color: #374151; margin-bottom: 10px;">To:</h3>
            <div style="font-weight: bold; font-size: 18px;">${invoice.customers.name}</div>
            ${invoice.customers.company ? `<div>${invoice.customers.company}</div>` : ''}
            <div>${invoice.customers.email}</div>
            ${invoice.customers.address ? `<div>${JSON.stringify(invoice.customers.address)}</div>` : ''}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600;">Description</th>
              <th style="padding: 15px; text-align: center; border-bottom: 2px solid #dee2e6; font-weight: 600;">Qty</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6; font-weight: 600;">Unit Price</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6; font-weight: 600;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 16px;">
          <div style="margin-bottom: 8px;">Subtotal: <strong>$${invoice.subtotal.toFixed(2)}</strong></div>
          ${invoice.discount_amount > 0 ? `<div style="margin-bottom: 8px;">Discount: <strong>-$${invoice.discount_amount.toFixed(2)}</strong></div>` : ''}
          ${invoice.tax_amount > 0 ? `<div style="margin-bottom: 8px;">Tax: <strong>$${invoice.tax_amount.toFixed(2)}</strong></div>` : ''}
          <div style="font-size: 20px; font-weight: bold; color: #2563eb; margin-top: 15px; padding-top: 15px; border-top: 2px solid #dee2e6;">
            Total: $${invoice.total_amount.toFixed(2)}
          </div>
          <div style="margin-top: 10px; font-size: 18px;">
            Amount Due: <strong>$${invoice.amount_due.toFixed(2)}</strong>
          </div>
        </div>

        ${invoice.notes ? `
          <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">Notes:</h4>
            <p style="margin: 0; line-height: 1.6;">${invoice.notes}</p>
          </div>
        ` : ''}

        ${invoice.terms ? `
          <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">Terms & Conditions:</h4>
            <p style="margin: 0; line-height: 1.6;">${invoice.terms}</p>
          </div>
        ` : ''}
      </div>
    `;
  }
};