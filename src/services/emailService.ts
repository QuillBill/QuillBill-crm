import { supabase } from '../lib/supabase';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export const emailService = {
  // Send invoice email
  async sendInvoice(invoiceId: string, recipientEmail?: string, customMessage?: string) {
    try {
      // Mock email sending for demo
      console.log('📧 Sending invoice email:', {
        invoiceId,
        recipientEmail,
        customMessage
      });

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Invoice email sent successfully (demo mode)',
        messageId: 'demo_' + Date.now()
      };
    } catch (error) {
      console.error('Error sending invoice:', error);
      return {
        success: true,
        message: 'Email sent in demo mode'
      };
    }
  },

  // Send welcome email
  async sendWelcomeEmail(customerEmail: string, customerName: string) {
    const template = this.getWelcomeEmailTemplate(customerName);
    return this.sendEmail(customerEmail, template);
  },

  // Send payment confirmation
  async sendPaymentConfirmation(customerEmail: string, paymentAmount: number, invoiceNumber: string) {
    const template = this.getPaymentConfirmationTemplate(paymentAmount, invoiceNumber);
    return this.sendEmail(customerEmail, template);
  },

  // Send subscription reminder
  async sendSubscriptionReminder(customerEmail: string, customerName: string, daysUntilRenewal: number) {
    const template = this.getSubscriptionReminderTemplate(customerName, daysUntilRenewal);
    return this.sendEmail(customerEmail, template);
  },

  // Generic email sender
  async sendEmail(to: string, template: EmailTemplate) {
    try {
      // Mock email sending with realistic simulation
      console.log('📧 Email Service (Demo Mode)');
      console.log('To:', to);
      console.log('Subject:', template.subject);
      console.log('Content preview:', template.html.substring(0, 100) + '...');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return { 
        success: true, 
        message: 'Email sent successfully (demo mode)',
        messageId: 'demo_msg_' + Date.now()
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: true, 
        message: 'Email processed in demo mode' 
      };
    }
  },

  // Email templates
  getWelcomeEmailTemplate(customerName: string): EmailTemplate {
    return {
      subject: 'Welcome to QuillBill!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to QuillBill!</h1>
          <p>Hi ${customerName},</p>
          <p>Thank you for choosing QuillBill for your billing needs. We're excited to help you manage your subscriptions and invoices efficiently.</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The QuillBill Team</p>
        </div>
      `,
      text: `Welcome to QuillBill! Hi ${customerName}, thank you for choosing QuillBill for your billing needs.`
    };
  },

  getPaymentConfirmationTemplate(amount: number, invoiceNumber: string): EmailTemplate {
    return {
      subject: `Payment Confirmation - Invoice ${invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Payment Confirmed</h1>
          <p>Your payment of <strong>$${amount.toFixed(2)}</strong> for invoice <strong>${invoiceNumber}</strong> has been successfully processed.</p>
          <p>Thank you for your business!</p>
          <p>Best regards,<br>The QuillBill Team</p>
        </div>
      `,
      text: `Payment Confirmed: Your payment of $${amount.toFixed(2)} for invoice ${invoiceNumber} has been processed.`
    };
  },

  getSubscriptionReminderTemplate(customerName: string, daysUntilRenewal: number): EmailTemplate {
    return {
      subject: 'Subscription Renewal Reminder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b;">Subscription Renewal Reminder</h1>
          <p>Hi ${customerName},</p>
          <p>This is a friendly reminder that your subscription will renew in <strong>${daysUntilRenewal} days</strong>.</p>
          <p>Your payment method will be automatically charged unless you make changes to your subscription.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>The QuillBill Team</p>
        </div>
      `,
      text: `Subscription Renewal Reminder: Hi ${customerName}, your subscription will renew in ${daysUntilRenewal} days.`
    };
  }
};