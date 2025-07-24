import "@/lib/utils"
import "@radix-ui/react-separator"
import "react"
import * as SeparatorPrimitive
import * as React
import { cn }

}

"use client";

const Separator = React.forwardRef<;
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;
>(;
  (;
    { className, orientation = "horizontal", decorative = true, ...props },
    ref;
  ) => (;
    <SeparatorPrimitive.Root;
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn();
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className;
      )}
      {...props}
    />;
  );
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator;
