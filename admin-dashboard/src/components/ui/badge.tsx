import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'destructive' | 'info' | 'outline' | 'teal';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-700 border-slate-200/60",
      secondary: "bg-slate-50 text-slate-600 border-slate-200/60",
      success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      warning: "bg-amber-50 text-amber-700 border-amber-200/60",
      danger: "bg-red-50 text-red-700 border-red-200/60",
      destructive: "bg-red-50 text-red-700 border-red-200/60",
      info: "bg-blue-50 text-blue-700 border-blue-200/60",
      outline: "bg-white border-slate-200 text-slate-700",
      teal: "bg-teal-50 text-teal-700 border-teal-200/60",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
