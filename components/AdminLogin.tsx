"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import SubmitButton from "./SubmitButton";
import { ToastNotification } from "./ToastNotification";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      ToastNotification.error("उपयोगकर्ता नाम और पासवर्ड दर्ज करें");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "लॉगिन विफल हुआ");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "कुछ गलत हो गया";
      ToastNotification.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-2xl border border-surface-border bg-surface-card p-7 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold text-ink">एडमिन लॉगिन</h1>
          <p className="text-sm text-ink-muted">जारी रखने के लिए साइन इन करें</p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">उपयोगकर्ता नाम</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">पासवर्ड</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <SubmitButton loading={loading} onClick={handleLogin} label="साइन इन करें" />
        </form>
      </div>
    </div>
  );
}
