import React from 'react';


import { cn } from '@/lib/utils';
}
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref;
  ) => (
<div
      ref={ref}
      className={cn(
        "shrink-0 bg-gray-200",
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className;
      )}
      {...props}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
    />
  );
);
Separator.displayName = "Separator";

export { Separator };
