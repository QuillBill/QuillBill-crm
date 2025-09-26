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
      const { data, error } = await supabase.functions.invoke('send-invoice', {
        body: {
          invoiceId,
          recipientEmail,
          message: customMessage
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
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
      // This would integrate with your email service (SendGrid, Mailgun, etc.)
      // For now, we'll simulate the email sending
      console.log('Sending email to:', to);
      console.log('Subject:', template.subject);
      console.log('Content:', template.html);

      // In a real implementation, you would call your email service API here
      // Example with SendGrid:
      // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     personalizations: [{ to: [{ email: to }] }],
      //     from: { email: 'noreply@quillbill.com' },
      //     subject: template.subject,
      //     content: [{ type: 'text/html', value: template.html }]
      //   })
      // });

      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
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