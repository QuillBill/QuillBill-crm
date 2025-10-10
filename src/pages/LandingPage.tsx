import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Complete customer profiles with billing history and contact management.'
    },
    {
      icon: FileText,
      title: 'Invoice Generation',
      description: 'Professional invoices with PDF generation and automated delivery.'
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Secure payments via Stripe with subscription management.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Real-time business insights and revenue tracking.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant infrastructure with data encryption.'
    },
    {
      icon: Zap,
      title: 'Automated Billing',
      description: 'Recurring billing cycles with dunning management.'
    }
  ];

  const benefits = [
    'Complete customer lifecycle management',
    'Professional invoice generation',
    'Secure payment processing',
    'Real-time analytics dashboard',
    'Multi-currency support',
    'API access for integrations'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QuillBill</h1>
                <p className="text-sm text-gray-500">Complete SaaS Billing Platform</p>
              </div>
            </div>
            <Link
              to="/app/dashboard"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Complete
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}SaaS Billing{' '}
            </span>
            Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive, production-ready billing platform built with React, TypeScript, 
            Supabase, and Stripe. Everything you need to manage customers, subscriptions, 
            invoices, and payments with a beautiful, modern interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 text-lg font-medium"
            >
              Try Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 text-lg font-medium"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for SaaS Billing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From customer management to payment processing, QuillBill provides 
              all the tools you need to run a successful subscription business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose QuillBill?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Built with modern technologies and best practices for scalability, 
              security, and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/app/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 inline-flex items-center gap-2 text-lg font-medium"
            >
              Start Building Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">QuillBill</h3>
                <p className="text-sm text-gray-400">Complete SaaS Billing Platform</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                Built with ❤️ for developers and businesses
              </p>
              <p className="text-sm text-gray-500 mt-1">
                © 2024 QuillBill. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;