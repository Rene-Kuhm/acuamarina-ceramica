import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'destructive' | 'info' | 'outline';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-900 border-slate-200",
      secondary: "bg-slate-200 text-slate-600 border-slate-300",
      success: "bg-emerald-100 text-emerald-900 border-emerald-200",
      warning: "bg-amber-100 text-amber-900 border-amber-200",
      danger: "bg-red-100 text-red-900 border-red-200",
      destructive: "bg-red-100 text-red-900 border-red-200",
      info: "bg-[#f0fdfa] text-[#14b8a6] border-[#ccfbf1]",
      outline: "bg-transparent border-slate-300 text-slate-700",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
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
