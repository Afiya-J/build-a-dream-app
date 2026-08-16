import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string | null | undefined;
  className?: string | undefined;
}

/** Error-state block, ready for backend validation messages in Phase 2. */
export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
