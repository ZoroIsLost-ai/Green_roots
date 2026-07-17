"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Trash2, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { ToastNotification } from "./ToastNotification";
import type { ResponseRecord } from "@/types";

const PAGE_SIZE = 20;

export default function AdminTable() {
  const router = useRouter();
  const [records, setRecords] = useState<ResponseRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/records?${params.toString()}`);
      if (res.status === 401 || res.status === 403) {
        router.push("/admin");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "रिकॉर्ड लोड नहीं हो सके");

      setRecords(json.records);
      setTotal(json.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : "कुछ गलत हो गया";
      ToastNotification.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, router]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/records/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "रिकॉर्ड हटाया नहीं जा सका");

      ToastNotification.success("रिकॉर्ड हटा दिया गया");
      loadRecords();
    } catch (err) {
      const message = err instanceof Error ? err.message : "कुछ गलत हो गया";
      ToastNotification.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  function handleExport() {
    window.open("/api/admin/export", "_blank");
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">प्रतिक्रियाएं</h1>
          <p className="text-sm text-ink-muted">कुल {total} रिकॉर्ड</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-card"
          >
            <Download className="h-4 w-4" />
            CSV एक्सपोर्ट
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-card"
          >
            <LogOut className="h-4 w-4" />
            लॉगआउट
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="नाम, फ़ोन, नगर या स्थान से खोजें"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-9 pr-3.5 text-sm text-ink shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-card text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">तारीख</th>
                <th className="px-4 py-3 font-medium">विभाग</th>
                <th className="px-4 py-3 font-medium">जिला</th>
                <th className="px-4 py-3 font-medium">नगर</th>
                <th className="px-4 py-3 font-medium">नाम</th>
                <th className="px-4 py-3 font-medium">फ़ोन</th>
                <th className="px-4 py-3 font-medium">स्थान</th>
                <th className="px-4 py-3 font-medium text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-ink-muted">
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner />
                      लोड हो रहा है...
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-ink-muted">
                    कोई रिकॉर्ड नहीं मिला
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-surface-card/60">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                      {new Date(record.created_at).toLocaleString("hi-IN")}
                    </td>
                    <td className="px-4 py-3">{record.vibhag}</td>
                    <td className="px-4 py-3">{record.zilla}</td>
                    <td className="px-4 py-3">{record.nagar}</td>
                    <td className="px-4 py-3 font-medium text-ink">{record.name}</td>
                    <td className="px-4 py-3">{record.phone}</td>
                    <td className="px-4 py-3">{record.location}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(record.id)}
                        disabled={deletingId === record.id}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === record.id ? (
                          <LoadingSpinner className="text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-surface-border px-4 py-3">
          <p className="text-xs text-ink-muted">
            पृष्ठ {page} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1.5 text-sm text-ink disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              पिछला
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1.5 text-sm text-ink disabled:opacity-40"
            >
              अगला
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
