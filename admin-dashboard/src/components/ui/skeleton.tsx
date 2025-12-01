import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rounded';
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const variants = {
    default: 'rounded-lg',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-200/60",
        variants[variant],
        // Shimmer animation
        "after:absolute after:inset-0",
        "after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent",
        "after:animate-[shimmer_1.5s_ease-in-out_infinite]",
        "after:translate-x-[-100%]",
        className
      )}
      {...props}
    />
  );
}

// Pre-built skeleton components for common use cases
function SkeletonText({ className, lines = 1, ...props }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/60 bg-white p-6 space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12" variant="rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" variant="rounded" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" variant="rounded" />
        <Skeleton className="h-8 w-20" variant="rounded" />
      </div>
    </div>
  );
}

function SkeletonAvatar({ className, size = 'md', ...props }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Skeleton
      className={cn(sizes[size], className)}
      variant="circular"
      {...props}
    />
  );
}

function SkeletonButton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      className={cn("h-10 w-24", className)}
      variant="rounded"
      {...props}
    />
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonButton };
