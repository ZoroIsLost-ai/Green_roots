import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { supabaseServer } from "@/lib/supabase/server";
import { submissionSchema } from "@/lib/validation";
import type { Hierarchy } from "@/types";

async function isValidChain(vibhag: string, zilla: string, nagar: string) {
  try {
    const filePath = path.join(process.cwd(), "data", "hierarchy.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const hierarchy: Hierarchy = JSON.parse(raw);
    return Boolean(hierarchy[vibhag]?.[zilla]?.includes(nagar));
  } catch {
    // If the hierarchy file can't be read, fail open on this check
    // rather than blocking every submission because of a file issue.
    return true;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "अमान्य अनुरोध" }, { status: 400 });
  }

  const isArray = Array.isArray(body);
  const items = isArray ? (body as any[]) : [body];

  if (items.length === 0) {
    return NextResponse.json({ error: "कोई डेटा प्रदान नहीं किया गया" }, { status: 400 });
  }

  const validatedItems = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const result = submissionSchema.safeParse(item);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const errorMsg = isArray 
        ? `पंक्ति ${i + 1}: ${firstIssue?.message ?? "अमान्य डेटा"}`
        : (firstIssue?.message ?? "अमान्य डेटा");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { vibhag, zilla, nagar } = result.data;
    const validChain = await isValidChain(vibhag, zilla, nagar);
    if (!validChain) {
      const errorMsg = isArray
        ? `पंक्ति ${i + 1}: चयनित विभाग / जिला / नगर मेल नहीं खाते`
        : "चयनित विभाग / जिला / नगर मेल नहीं खाते";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    validatedItems.push({
      vibhag: result.data.vibhag,
      zilla: result.data.zilla,
      nagar: result.data.nagar,
      sanyojak_name: result.data.sanyojak_name,
      sanyojak_phone: result.data.sanyojak_phone,
      sanyojak_location: result.data.sanyojak_location,
      sah_sanyojak_name: result.data.sah_sanyojak_name,
      sah_sanyojak_phone: result.data.sah_sanyojak_phone,
      sah_sanyojak_location: result.data.sah_sanyojak_location,
    });
  }

  const supabase = supabaseServer();
  const { error } = await supabase.from("responses").insert(validatedItems);

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json(
      { error: "जमा करने में समस्या हुई, कृपया पुनः प्रयास करें" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
