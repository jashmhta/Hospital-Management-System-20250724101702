import "@/lib/utils"
import "@radix-ui/react-slider"
import "react"
import * as SliderPrimitive
import * as React
import { cn }

}

"use client";

const Slider = React.forwardRef<;
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;
>(({ className, ...props }, ref) => (;
  <SliderPrimitive.Root;
    ref={ref}
    className={cn();
      "relative flex w-full touch-none select-none items-center",
      className;
    )}
    {...props}
  >;
    >;
      <SliderPrimitive.Range className="absolute h-full bg-primary" />;
    </SliderPrimitive.Track>;
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />;
  </SliderPrimitive.Root>;
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider;
