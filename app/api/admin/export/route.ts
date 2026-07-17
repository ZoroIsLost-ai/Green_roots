import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

function toCsvValue(value: string): string {
  const needsQuoting = /[",\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase export error:", error.message);
    return NextResponse.json({ error: "एक्सपोर्ट विफल हुआ" }, { status: 500 });
  }

  const headers = [
    "Date",
    "विभाग",
    "जिला",
    "नगर",
    "संयोजक नाम",
    "संयोजक फ़ोन",
    "संयोजक स्थान",
    "सह संयोजक नाम",
    "सह संयोजक फ़ोन",
    "सह संयोजक स्थान",
  ];
  const rows = (data ?? []).map((row) => [
    new Date(row.created_at).toLocaleString("hi-IN"),
    row.vibhag,
    row.zilla,
    row.nagar,
    row.sanyojak_name,
    row.sanyojak_phone,
    row.sanyojak_location,
    row.sah_sanyojak_name,
    row.sah_sanyojak_phone,
    row.sah_sanyojak_location,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => toCsvValue(String(cell))).join(","))
    .join("\n");

  // Prefix a UTF-8 BOM so Excel renders Devanagari text correctly.
  const csvWithBom = "\uFEFF" + csv;

  return new NextResponse(csvWithBom, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="responses-${Date.now()}.csv"`,
    },
  });
}
