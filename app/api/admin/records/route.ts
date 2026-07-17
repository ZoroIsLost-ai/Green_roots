import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.trim() ?? "";
  const vibhag = searchParams.get("vibhag")?.trim() ?? "";
  const zilla = searchParams.get("zilla")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "20")));

  const supabase = supabaseServer();

  // Fetch paginated records query
  let query = supabase
    .from("responses")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (vibhag) query = query.eq("vibhag", vibhag);
  if (zilla) query = query.eq("zilla", zilla);
  if (search) {
    query = query.or(
      `sanyojak_name.ilike.%${search}%,sanyojak_phone.ilike.%${search}%,sanyojak_location.ilike.%${search}%,sah_sanyojak_name.ilike.%${search}%,sah_sanyojak_phone.ilike.%${search}%,sah_sanyojak_location.ilike.%${search}%,nagar.ilike.%${search}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return NextResponse.json({ error: "रिकॉर्ड लोड नहीं हो सके" }, { status: 500 });
  }

  // Fetch stats (non-paginated) for the dashboard indicators
  const { data: allFields } = await supabase
    .from("responses")
    .select("sanyojak_name, nagar");

  const uniqueUsers = new Set(
    (allFields ?? [])
      .map((r) => r.sanyojak_name)
      .filter((name) => name && name !== "NA")
  ).size;

  const activeCities = new Set(
    (allFields ?? [])
      .map((r) => r.nagar)
      .filter((nagar) => nagar && nagar !== "NA")
  ).size;

  return NextResponse.json({
    records: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    stats: {
      uniqueUsers,
      activeCities,
    },
  });
}
