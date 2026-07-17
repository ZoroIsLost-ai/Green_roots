import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * Serves /data/hierarchy.json from disk on every request, so the
 * dropdown data can be edited (or replaced by a mounted volume)
 * without touching or rebuilding the application code.
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "hierarchy.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(raw);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: "hierarchy.json को पढ़ा नहीं जा सका" },
      { status: 500 }
    );
  }
}
