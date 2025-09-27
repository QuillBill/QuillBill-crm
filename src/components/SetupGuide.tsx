import React, { useState } from 'react';
import { X, Database, CreditCard, Mail, Settings, CheckCircle, ExternalLink } from 'lucide-react';

interface SetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ isOpen, onClose }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(n => n !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const steps = [
    {
      id: 1,
      title: 'Set up Supabase Database',
      description: 'Create your Supabase project and configure the database',
      icon: Database,
      color: 'bg-blue-500',
      instructions: [
        'Go to supabase.com and create a new project',
        'Copy your project URL and anon key',
        'Add them to your environment variables',
        'Run the database migration to create tables'
      ],
      links: [
        { text: 'Supabase Dashboard', url: 'https://supabase.com/dashboard' }
      ]
    },
    {
      id: 2,
      title: 'Configure Stripe Payments',
      description: 'Set up Stripe for payment processing',
      icon: CreditCard,
      color: 'bg-purple-500',
      instructions: [
        'Create a Stripe account at stripe.com',
        'Get your publishable and secret keys',
        'Add webhook endpoint for real-time updates',
        'Configure your payment methods'
      ],
      links: [
        { text: 'Stripe Dashboard', url: 'https://dashboard.stripe.com' }
      ]
    },
    {
      id: 3,
      title: 'Email Service Setup',
      description: 'Configure email delivery for invoices and notifications',
      icon: Mail,
      color: 'bg-green-500',
      instructions: [
        'Choose an email service (SendGrid, Mailgun, etc.)',
        'Get your API keys',
        'Configure email templates',
        'Test email delivery'
      ],
      links: [
        { text: 'SendGrid', url: 'https://sendgrid.com' },
        { text: 'Mailgun', url: 'https://mailgun.com' }
      ]
    },
    {
      id: 4,
      title: 'Environment Configuration',
      description: 'Set up all environment variables',
      icon: Settings,
      color: 'bg-orange-500',
      instructions: [
        'Copy .env.example to .env',
        'Fill in all required variables',
        'Restart your development server',
        'Test all connections'
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">QuillBill Setup Guide</h2>
            <p className="text-gray-600 mt-1">Complete these steps to make your platform fully functional</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                {completedSteps.length}/{steps.length}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {completedSteps.length === steps.length 
                ? '🎉 All setup complete! Your QuillBill platform is ready to use.'
                : `${steps.length - completedSteps.length} steps remaining`
              }
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const Icon = step.icon;

              return (
                <div 
                  key={step.id}
                  className={`border rounded-lg p-6 transition-all duration-200 ${
                    isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                        <button
                          onClick={() => toggleStep(step.id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            isCompleted 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Completed
                            </>
                          ) : (
                            'Mark Complete'
                          )}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {step.instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                            </div>
                            <span className="text-sm text-gray-700">{instruction}</span>
                          </div>
                        ))}
                      </div>

                      {step.links && (
                        <div className="flex flex-wrap gap-2">
                          {step.links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              {link.text}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
            <p className="text-sm text-blue-800 mb-3">
              If you encounter any issues during setup, check our documentation or reach out for support.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Documentation
              </a>
              <span className="text-blue-400">•</span>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};