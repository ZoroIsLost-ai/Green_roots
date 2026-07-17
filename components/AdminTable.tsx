"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  MapPin,
  RefreshCw,
} from "lucide-react";
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

  const [stats, setStats] = useState({
    uniqueUsers: 0,
    activeCities: 0,
  });

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
      if (json.stats) {
        setStats(json.stats);
      }
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
    if (!confirm("क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं?")) return;
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 relative overflow-hidden">
      {/* Ambient backgrounds for Admin Dashboard */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary-100/10 blur-[120px] z-0" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-[400px] w-[400px] rounded-full bg-emerald-100/10 blur-[100px] z-0" />

      {/* Top Header Card */}
      <div className="relative z-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-border bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-ink">Admin Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">
            Manage and review environmental submissions
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl bg-ink text-white px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={loadRecords}
            className="flex items-center gap-2 rounded-xl border border-surface-border bg-white text-ink-muted px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:bg-surface-soft active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 text-red-600 px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:bg-red-50 active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats and Search Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Entries */}
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Total Entries
            </p>
            <p className="text-2xl font-bold text-ink mt-0.5">{total}</p>
          </div>
        </div>

        {/* Unique Users */}
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Unique Users
            </p>
            <p className="text-2xl font-bold text-ink mt-0.5">{stats.uniqueUsers}</p>
          </div>
        </div>

        {/* Active Cities */}
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Active Cities
            </p>
            <p className="text-2xl font-bold text-ink mt-0.5">{stats.activeCities}</p>
          </div>
        </div>

        {/* Search Submissions */}
        <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm flex flex-col justify-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Name, email, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-soft py-2 pl-9 pr-3 text-sm text-ink focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-card text-xs uppercase tracking-wide text-ink-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3.5 font-medium">तारीख</th>
                <th className="px-4 py-3.5 font-medium">विभाग</th>
                <th className="px-4 py-3.5 font-medium">जिला</th>
                <th className="px-4 py-3.5 font-medium">नगर</th>
                <th className="px-4 py-3.5 font-medium">संयोजक विवरण</th>
                <th className="px-4 py-3.5 font-medium">सह संयोजक विवरण</th>
                <th className="px-4 py-3.5 font-medium text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-ink-muted">
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner />
                      लोड हो रहा है...
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-ink-muted">
                    कोई रिकॉर्ड नहीं मिला
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-surface-card/60 transition-colors">
                    <td className="whitespace-nowrap px-4 py-4 text-ink-muted">
                      {new Date(record.created_at).toLocaleString("hi-IN")}
                    </td>
                    <td className="px-4 py-4 text-ink">{record.vibhag}</td>
                    <td className="px-4 py-4 text-ink">{record.zilla}</td>
                    <td className="px-4 py-4 text-ink">{record.nagar}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-ink">{record.sanyojak_name}</div>
                      <div className="text-xs text-ink-muted mt-0.5">
                        {record.sanyojak_phone !== "NA" ? record.sanyojak_phone : "कोई फ़ोन नहीं"} | {record.sanyojak_location}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-ink">{record.sah_sanyojak_name}</div>
                      <div className="text-xs text-ink-muted mt-0.5">
                        {record.sah_sanyojak_phone !== "NA" ? record.sah_sanyojak_phone : "कोई फ़ोन नहीं"} | {record.sah_sanyojak_location}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleDelete(record.id)}
                        disabled={deletingId === record.id}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                        title="रिकॉर्ड हटाएं"
                      >
                        {deletingId === record.id ? (
                          <LoadingSpinner className="text-red-500 h-4 w-4" />
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

        {/* Pagination bar */}
        <div className="flex items-center justify-between border-t border-surface-border px-4 py-3 bg-white">
          <p className="text-xs text-ink-muted font-medium">
            पृष्ठ {page} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition-all hover:bg-surface-soft disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              पिछला
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition-all hover:bg-surface-soft disabled:opacity-40"
            >
              अगला
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
