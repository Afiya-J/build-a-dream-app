import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "size-4", md: "size-6", lg: "size-8" } as const;

export function LoadingSpinner({ className, label = "Loading", size = "md" }: LoadingSpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} aria-hidden="true" />
    </span>
  );
}
