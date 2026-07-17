"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Leaf } from "lucide-react";
import SubmitButton from "./SubmitButton";
import { ToastNotification } from "./ToastNotification";
import Link from "next/link";

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

      ToastNotification.success("सफलतापूर्वक लॉगिन किया गया");
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
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 relative overflow-hidden">
      {/* Premium Ambient Background Blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary-100/20 blur-[120px] z-0" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-[450px] w-[450px] rounded-full bg-emerald-100/15 blur-[110px] z-0" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2ece9_1.5px,transparent_1.5px),linear-gradient(to_bottom,#e2ece9_1.5px,transparent_1.5px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 z-0" />

      {/* Floating back to home link */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-primary transition-colors z-20"
      >
        <Leaf className="h-4 w-4" />
        मुख्य पृष्ठ पर वापस जाएं (Back to Home)
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-surface-border bg-white p-7 shadow-sm relative z-10">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-bold text-ink">एडमिन लॉगिन</h1>
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
            <label className="text-sm font-semibold text-ink">उपयोगकर्ता नाम (Username)</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-soft px-3.5 py-2.5 text-sm text-ink shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">पासवर्ड (Password)</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-soft px-3.5 py-2.5 text-sm text-ink shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <SubmitButton loading={loading} onClick={handleLogin} label="साइन इन करें (Sign In)" />
        </form>
      </div>
    </div>
  );
}
