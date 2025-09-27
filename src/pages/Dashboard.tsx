import React from 'react';
import { DollarSign, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { useOptimizedData } from '../hooks/useOptimizedData';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
import { testSupabaseConnection } from '../lib/supabase';
import { useState, useEffect } from 'react';

const revenueData = [
  { month: 'Jan', revenue: 12000, customers: 45 },
  { month: 'Feb', revenue: 19000, customers: 52 },
  { month: 'Mar', revenue: 15000, customers: 48 },
  { month: 'Apr', revenue: 25000, customers: 61 },
  { month: 'May', revenue: 22000, customers: 58 },
  { month: 'Jun', revenue: 30000, customers: 67 },
];

export const Dashboard: React.FC = () => {
  const [connectionTest, setConnectionTest] = useState<{ success: boolean; message: string } | null>(null);
  
  const { data: customers, loading: customersLoading } = useOptimizedData({
    table: 'customers',
    limit: 5,
    enableRealtime: true
  });

  useEffect(() => {
    const checkConnection = async () => {
      const result = await testSupabaseConnection();
      setConnectionTest(result);
    };
    checkConnection();
  }, []);

  const { data: subscriptions, loading: subscriptionsLoading } = useOptimizedData({
    table: 'subscriptions',
    limit: 5,
    enableRealtime: true
  });

  if (customersLoading || subscriptionsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Alert */}
      {connectionTest && !connectionTest.success && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Database Connection Issue</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {connectionTest.message}. Using demo data for now. Please set up Supabase to see real data.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your business.
            {connectionTest?.success ? ' (Live data)' : ' (Demo data)'}
          </p>
        </div>
      </div>