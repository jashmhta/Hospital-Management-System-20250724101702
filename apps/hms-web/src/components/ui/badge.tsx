import type React from 'react';


import { cn } from '@/lib/utils';
\1\n\nexport \2 BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

const Badge = ({ className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    \1,\2 'border border-gray-200 text-gray-800',
    \1,\2 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
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
