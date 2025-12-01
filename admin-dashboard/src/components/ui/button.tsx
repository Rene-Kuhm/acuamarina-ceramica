import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:scale-[0.98]"
    );

    const variants = {
      primary: cn(
        "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
        "hover:from-teal-600 hover:to-teal-700",
        "focus-visible:ring-teal-500",
        "shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30"
      ),
      secondary: cn(
        "bg-slate-100 text-slate-900",
        "hover:bg-slate-200",
        "focus-visible:ring-slate-400"
      ),
      outline: cn(
        "border-2 border-slate-200 bg-white text-slate-700",
        "hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900",
        "focus-visible:ring-slate-400"
      ),
      ghost: cn(
        "bg-transparent text-slate-600",
        "hover:bg-slate-100 hover:text-slate-900",
        "focus-visible:ring-slate-400"
      ),
      destructive: cn(
        "bg-gradient-to-r from-red-500 to-red-600 text-white",
        "hover:from-red-600 hover:to-red-700",
        "focus-visible:ring-red-500",
        "shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30"
      ),
      success: cn(
        "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
        "hover:from-emerald-600 hover:to-emerald-700",
        "focus-visible:ring-emerald-500",
        "shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30"
      ),
    };

    const sizes = {
      xs: "h-7 px-2.5 text-xs rounded-lg",
      sm: "h-9 px-3.5 text-sm",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 rounded-xl",
    };

    return (
      <Comp
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
