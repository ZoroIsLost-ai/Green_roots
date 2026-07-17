"use client";

import LoadingSpinner from "./LoadingSpinner";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
};

export default function SubmitButton({
  loading,
  disabled = false,
  onClick,
  label = "जमा करें",
}: SubmitButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all",
        "hover:bg-primary-700 active:scale-[0.99]",
        isDisabled && "cursor-not-allowed opacity-60 hover:bg-primary"
      )}
    >
      {loading && <LoadingSpinner className="text-white" />}
      {loading ? "जमा हो रहा है..." : label}
    </button>
  );
}
