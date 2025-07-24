import React, { type InputHTMLAttributes, forwardRef } from 'react';


import { cn } from '@/lib/utils';
\1\n\nexport \2 InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

/**
 * Input component for form fields;
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      \1>
        <input>
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder: text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50";
            error && "border-red-500 focus: ring-red-500";
            className;
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}\1>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
