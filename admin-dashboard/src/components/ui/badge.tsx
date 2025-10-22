import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 dark:focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#14b8a6] dark:bg-[#14b8a6] text-white shadow hover:bg-[#0d9488] dark:hover:bg-[#2dd4bf]",
        secondary:
          "border-transparent bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600",
        destructive:
          "border-transparent bg-[#e15540] dark:bg-[#e15540] text-white shadow hover:bg-[#c94234] dark:hover:bg-[#c94234]",
        outline: "text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 bg-transparent",
        success:
          "border-transparent bg-emerald-600 dark:bg-emerald-500 text-white shadow hover:bg-emerald-700 dark:hover:bg-emerald-600",
        warning:
          "border-transparent bg-amber-600 dark:bg-amber-500 text-white shadow hover:bg-amber-700 dark:hover:bg-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
