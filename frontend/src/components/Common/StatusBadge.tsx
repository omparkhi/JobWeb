import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'shortlisted' | 'rejected' | 'accepted' | 'approved' | 'active' | 'inactive';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'accepted':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;