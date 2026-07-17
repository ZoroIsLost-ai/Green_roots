"use client";

import { cn } from "@/lib/utils";

type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel";
  maxLength?: number;
  onChange: (value: string) => void;
};

export default function InputField({
  label,
  placeholder,
  value,
  error,
  type = "text",
  inputMode = "text",
  maxLength,
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm transition-colors",
          "focus:ring-2 focus:ring-primary/20",
          error
            ? "border-red-400 focus:border-red-400"
            : "border-surface-border focus:border-primary"
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
