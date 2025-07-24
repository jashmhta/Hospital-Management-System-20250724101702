import React, { type SelectHTMLAttributes, forwardRef } from 'react';


import { cn } from '@/lib/utils';
\1\n\nexport \2 SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: Array\1>
}

/**
 * Select component for dropdown selection;
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, children, ...props }, ref) => {
    return (
      \1>
        <select>
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus: outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50";
            error && "border-red-500 focus: ring-red-500";
            className;
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            \1>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}\1>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
