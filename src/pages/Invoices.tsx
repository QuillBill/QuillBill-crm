import React from 'react';
import { Plus, Mail, Calendar, DollarSign, FileText } from 'lucide-react';
import { useOptimizedData } from '../hooks/useOptimizedData';
import { OptimizedTable } from '../components/ui/OptimizedTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Invoice } from '../types';

const columns = [
  {
    key: 'invoice_number' as keyof Invoice,
    label: 'Invoice #',
    sortable: true,
    render: (value: string, invoice: Invoice) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">
            {new Date(invoice.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    )
  },
  {
    key: 'customer_name' as keyof Invoice,
    label: 'Customer',
    render: (value: string, invoice: Invoice) => (
      <div>
        <div className="font-medium text-gray-900">{value || 'N/A'}</div>
        <div className="text-sm text-gray-500 flex items-center">
          <Mail className="w-3 h-3 mr-1" />
          {invoice.customer_email || 'N/A'}
        </div>
      </div>
    )
  },
  {
    key: 'status' as keyof Invoice,
    label: 'Status',
    sortable: true,
    render: (value: string) => <StatusBadge status={value} />
  },
  {
    key: 'total_amount' as keyof Invoice,
    label: 'Total Amount',
    sortable: true,
    render: (value: number) => (
      <div className="flex items-center font-medium text-gray-900">
        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
        ${value?.toFixed(2) || '0.00'}
      </div>
    )
  },
  {
    key: 'amount_due' as keyof Invoice,
    label: 'Amount Due',
    sortable: true,
    render: (value: number) => (
      <div className={`font-medium ${value > 0 ? 'text-red-600' : 'text-green-600'}`}>
        ${value?.toFixed(2) || '0.00'}
      </div>
    )
  },
  {
    key: 'due_date' as keyof Invoice,
    label: 'Due Date',
    sortable: true,
    render: (value: string) => (
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-3 h-3 mr-1" />
        {value ? new Date(value).toLocaleDateString() : 'No due date'}
      </div>
    )
  }
];

export const Invoices: React.FC = () => {
  const { data: invoices, loading, error, refetch } = useOptimizedData<Invoice>({
    table: 'invoices',
    orderBy: { column: 'created_at', ascending: false },
    enableRealtime: true
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your invoices and track payments</p>
        </div>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => {
            // Add invoice modal would open here
            console.log('Create invoice');
          }}
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading invoices: {error}</p>
          <button 
            onClick={refetch}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      <OptimizedTable
        data={invoices}
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

export default Invoices;