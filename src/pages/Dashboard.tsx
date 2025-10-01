import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useOptimizedData } from '../hooks/useOptimizedData';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';

interface DashboardStats {
  totalCustomers: number;
  totalInvoices: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  const { data: customers } = useOptimizedData({
    table: 'customers',
    enableRealtime: true
  });

  const { data: invoices } = useOptimizedData({
    table: 'invoices',
    enableRealtime: true
  });

  useEffect(() => {
    // Calculate stats from data
    const totalCustomers = customers?.length || 0;
    const totalInvoices = invoices?.length || 0;
    const totalRevenue = invoices?.reduce((sum: number, invoice: any) => sum + (invoice.total_amount || 0), 0) || 0;
    const monthlyGrowth = 12.5; // Mock growth percentage

    setStats({
      totalCustomers,
      totalInvoices,
      totalRevenue,
      monthlyGrowth
    });

    setLoading(false);
  }, [customers, invoices]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toLocaleString(),
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+2.1%',
      changeType: 'positive' as const
    }
  ];

  const recentInvoices = invoices?.slice(0, 5) || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          </div>
          <div className="p-6">
            {recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {recentInvoices.map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {invoice.invoice_number}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${invoice.total_amount?.toFixed(2) || '0.00'}
                      </p>
                      <div className="flex items-center">
                        {invoice.status === 'paid' ? (
                          <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                        ) : invoice.status === 'overdue' ? (
                          <AlertCircle className="w-3 h-3 text-red-600 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 text-yellow-600 mr-1" />
                        )}
                        <span className="text-xs text-gray-500 capitalize">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No invoices yet</p>
                <p className="text-sm text-gray-400">Create your first invoice to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Create Invoice</span>
                </div>
                <span className="text-blue-600">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Add Customer</span>
                </div>
                <span className="text-green-600">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Schedule Payment</span>
                </div>
                <span className="text-purple-600">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;