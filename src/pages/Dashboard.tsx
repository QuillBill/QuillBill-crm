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
      {connectionTest && (
        <div className={`border rounded-lg p-4 ${
          connectionTest.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            {connectionTest.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            )}
            <div>
              <h3 className={`font-medium ${
                connectionTest.success ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {connectionTest.success ? 'System Status: Online' : 'Demo Mode Active'}
              </h3>
              <p className={`text-sm mt-1 ${
                connectionTest.success ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {connectionTest.message}
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
            <span className="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {connectionTest?.success ? '🟢 Live System' : '🔵 Demo Mode'}
            </span>
          </p>
        </div>
      </div>