import { cn } from "@/lib/utils";

type FormCardProps = {
  children: React.ReactNode;
  steps: { label: string; value: string; active: boolean }[];
};

export default function FormCard({ children, steps }: FormCardProps) {
  return (
    <div className="animate-fade-in rounded-2xl border border-surface-border bg-surface-card p-5 shadow-sm sm:p-7">
      <ol className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {steps.map((step, i) => (
          <li key={step.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                step.active
                  ? "border-primary/30 bg-primary/10 text-primary-700"
                  : step.value
                  ? "border-surface-border bg-white text-ink-muted"
                  : "border-dashed border-surface-border text-ink-faint"
              )}
            >
              <span className="text-[10px] uppercase tracking-wide text-ink-faint">
                {step.label}
              </span>
              {step.value && <span>{step.value}</span>}
            </span>
            {i < steps.length - 1 && (
              <span className="text-ink-faint" aria-hidden="true">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
      {children}
    </div>
  );
}
