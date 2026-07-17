import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = supabaseServer();
  const { error } = await supabase.from("responses").delete().eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error.message);
    return NextResponse.json({ error: "रिकॉर्ड हटाया नहीं जा सका" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
