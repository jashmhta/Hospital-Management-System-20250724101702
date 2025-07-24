import "@/lib/utils"
import "react"
import forwardRef }
import LabelHTMLAttributes
import React
import { cn }
import { type

}

/**;
 * Label component for form fields;
 */;
const Label = forwardRef<HTMLLabelElement, LabelProps>(;
  ({ className, children, required, ...props }, ref) => {
    return();
      <label>;
        className={cn();
          "text-sm font-medium text-gray-700",
          className;
        )}
        ref={ref}
        {...props}
      >;
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>;
    );

);

Label.displayName = "Label";

export { Label };
