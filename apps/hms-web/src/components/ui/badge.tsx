import React from 'react';


import { cn } from '@/lib/utils';
}
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

const Badge = ({ className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800';
    secondary: 'bg-gray-100 text-gray-800';
    outline: 'border border-gray-200 text-gray-800';
    success: 'bg-green-100 text-green-800';
    warning: 'bg-yellow-100 text-yellow-800';
    danger: 'bg-red-100 text-red-800';
  };

  return (
<div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className;
      )}
      {...props}
    />
  );
export { Badge };
