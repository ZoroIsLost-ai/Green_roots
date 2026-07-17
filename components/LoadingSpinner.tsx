import { cn } from "@/lib/utils";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin-slow text-current", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M22 12a10 10 0 0 0-10-10V0a12 12 0 0 1 12 12h-2Z"
      />
    </svg>
  );
}
