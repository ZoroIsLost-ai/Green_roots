"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function DropdownField({
  label,
  placeholder,
  value,
  options,
  disabled = false,
  onChange,
}: DropdownFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">{label}</label>
      <div className="relative">
        <select
          className={cn(
            "w-full appearance-none rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm transition-colors",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            disabled && "cursor-not-allowed bg-surface-card text-ink-faint"
          )}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint",
            disabled && "opacity-50"
          )}
        />
      </div>
    </div>
  );
}
