import React from 'react';


import { cn } from '@/lib/utils';
}
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    \1>
      <input>
        type="checkbox"
        ref={ref}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus: outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
          className;
        )}
        {...props}
      />
      \1>
<svg className="absolute inset-0 h-full w-full stroke-white peer-checked:opacity-100 opacity-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          strokeWidth={2}
        >
<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  );
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
