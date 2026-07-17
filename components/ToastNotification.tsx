"use client";

import { toast } from "sonner";

/**
 * Thin wrapper around sonner so the rest of the app calls one
 * consistent API for success / error notifications.
 */
export const ToastNotification = {
  success(message: string) {
    toast.success(message);
  },
  error(message: string) {
    toast.error(message);
  },
};
