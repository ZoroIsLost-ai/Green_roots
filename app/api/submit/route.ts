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

  const result = submissionSchema.safeParse(body);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "अमान्य डेटा" },
      { status: 400 }
    );
  }

  const { vibhag, zilla, nagar } = result.data;
  const validChain = await isValidChain(vibhag, zilla, nagar);
  if (!validChain) {
    return NextResponse.json(
      { error: "चयनित विभाग / जिला / नगर मेल नहीं खाते" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();
  const { error } = await supabase.from("responses").insert({
    vibhag: result.data.vibhag,
    zilla: result.data.zilla,
    nagar: result.data.nagar,
    name: result.data.name,
    phone: result.data.phone,
    location: result.data.location,
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json(
      { error: "जमा करने में समस्या हुई, कृपया पुनः प्रयास करें" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
