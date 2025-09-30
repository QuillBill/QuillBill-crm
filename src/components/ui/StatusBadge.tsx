import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'paid':
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'overdue':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'sent':
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(status)}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};