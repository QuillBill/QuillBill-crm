import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { testSupabaseConnection } from '../lib/supabase';
import toast from 'react-hot-toast';

export const ConnectionStatus: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    supabase: boolean;
    stripe: boolean;
    loading: boolean;
  }>({
    supabase: false,
    stripe: false,
    loading: true
  });

  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    setConnectionStatus(prev => ({ ...prev, loading: true }));

    // Test Supabase connection
    const supabaseTest = await testSupabaseConnection();
    
    // Test Stripe connection (check if keys are present)
    const stripeTest = !!(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    setConnectionStatus({
      supabase: supabaseTest.success,
      stripe: stripeTest,
      loading: false
    });

    if (!supabaseTest.success) {
      toast.error('Supabase connection failed. Please check your configuration.');
    }
    if (!stripeTest) {
      toast.error('Stripe keys not configured. Payment processing unavailable.');
    }
  };

  const getStatusColor = (connected: boolean) => 
    connected ? 'text-green-600' : 'text-red-600';

  const getStatusIcon = (connected: boolean) => 
    connected ? CheckCircle : AlertCircle;

  if (connectionStatus.loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Checking connections...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Database className={`w-4 h-4 ${getStatusColor(connectionStatus.supabase)}`} />
        <span className={`text-sm ${getStatusColor(connectionStatus.supabase)}`}>
          Database
        </span>
        {React.createElement(getStatusIcon(connectionStatus.supabase), {
          className: `w-3 h-3 ${getStatusColor(connectionStatus.supabase)}`
        })}
      </div>
      
      <div className="flex items-center gap-2">
        <Wifi className={`w-4 h-4 ${getStatusColor(connectionStatus.stripe)}`} />
        <span className={`text-sm ${getStatusColor(connectionStatus.stripe)}`}>
          Payments
        </span>
        {React.createElement(getStatusIcon(connectionStatus.stripe), {
          className: `w-3 h-3 ${getStatusColor(connectionStatus.stripe)}`
        })}
      </div>

      <button
        onClick={checkConnections}
        className="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        Refresh
      </button>
    </div>
  );
};