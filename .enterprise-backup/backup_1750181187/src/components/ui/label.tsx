import React, { type LabelHTMLAttributes, forwardRef } from 'react';


import { cn } from '@/lib/utils';
\1
}
}

/**
 * Label component for form fields;
 */
const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label>
        className={cn(
          "text-sm font-medium text-gray-700",
          className;
        )}
        ref={ref}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label };
