import "next-themes"
import { useTheme }

}

"use client";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return();
    <Sonner>;
      theme={theme as ToasterProps["theme"]}
      className="toaster group";
      toastOptions={{
        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg",
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground";
        }}}
      {...props}
    />;
  );
export { Toaster;
