import React from 'react';
import { Plus, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import { useOptimizedData } from '../hooks/useOptimizedData';
import { OptimizedTable } from '../components/ui/OptimizedTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Customer } from '../types';

const columns = [
  {
    key: 'name' as keyof Customer,
    label: 'Customer',
    sortable: true,
    render: (value: string, customer: Customer) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {value.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <Mail className="w-3 h-3 mr-1" />
            {customer.email}
          </div>
        </div>
      </div>
    )
  },
  {
    key: 'phone' as keyof Customer,
    label: 'Contact',
    render: (value: string) => (
      <div className="flex items-center text-sm text-gray-600">
        <Phone className="w-3 h-3 mr-1" />
        {value}
      </div>
    )
  },
  {
    key: 'status' as keyof Customer,
    label: 'Status',
    sortable: true,
    render: (value: string) => <StatusBadge status={value} />
  },
  {
    key: 'total_revenue' as keyof Customer,
    label: 'Total Revenue',
    sortable: true,
    render: (value: number) => (
      <div className="flex items-center font-medium text-gray-900">
        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
        ${value?.toLocaleString() || '0'}
      </div>
    )
  },
  {
    key: 'subscriptions' as keyof Customer,
    label: 'Subscriptions',
    sortable: true,
    render: (value: number) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {value || 0} active
      </span>
    )
  },
  {
    key: 'created_at' as keyof Customer,
    label: 'Join Date',
    sortable: true,
    render: (value: string) => (
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(value).toLocaleDateString()}
      </div>
    )
  }
];

export const Customers: React.FC = () => {
  const { data: customers, loading, error, refetch } = useOptimizedData<Customer>({
    table: 'customers',
    orderBy: { column: 'created_at', ascending: false },
    enableRealtime: true
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer base and track their activity</p>
        </div>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => {
            // Add customer modal would open here
            console.log('Add customer');
          }}
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading customers: {error}</p>
          <button 
            onClick={refetch}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      <OptimizedTable
        data={customers}
        columns={columns}
        loading={loading}
        searchable={true}
        filterable={true}
        pageSize={15}
        className="animate-fadeIn"
      />
    </div>
  );
};

export default Customers;