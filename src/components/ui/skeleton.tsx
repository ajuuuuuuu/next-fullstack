import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted h-4 w-full bg-neutral-300 dark:bg-neutral-700", className)}
      {...props}
    />
  )
}

export { Skeleton }
