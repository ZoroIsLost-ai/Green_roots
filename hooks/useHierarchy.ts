"use client";

import { useEffect, useMemo, useState } from "react";
import type { Hierarchy } from "@/types";

export function useHierarchy() {
  const [data, setData] = useState<Hierarchy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/hierarchy")
      .then((res) => {
        if (!res.ok) throw new Error("डेटा लोड नहीं हो सका");
        return res.json();
      })
      .then((json: Hierarchy) => {
        if (!cancelled) setData(json);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const vibhagOptions = useMemo(() => (data ? Object.keys(data) : []), [data]);

  const getZillaOptions = (vibhag: string) => {
    if (!data || !vibhag) return [];
    return Object.keys(data[vibhag] ?? {});
  };

  const getNagarOptions = (vibhag: string, zilla: string) => {
    if (!data || !vibhag || !zilla) return [];
    return data[vibhag]?.[zilla] ?? [];
  };

  return { data, loading, error, vibhagOptions, getZillaOptions, getNagarOptions };
}
