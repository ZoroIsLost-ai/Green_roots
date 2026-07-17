import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

function timingSafeStringEqual(a: string, b: string): boolean {
  // Compare in constant time regardless of where the strings differ.
  const maxLen = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < maxLen; i++) {
    const charA = a.charCodeAt(i) || 0;
    const charB = b.charCodeAt(i) || 0;
    mismatch |= charA ^ charB;
  }
  return mismatch === 0;
}

export async function POST(req: NextRequest) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return NextResponse.json(
      { error: "एडमिन प्रमाणीकरण कॉन्फ़िगर नहीं है" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "अमान्य अनुरोध" }, { status: 400 });
  }

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "उपयोगकर्ता नाम और पासवर्ड आवश्यक है" }, { status: 400 });
  }

  const { username, password } = result.data;
  const valid =
    timingSafeStringEqual(username, adminUsername) &&
    timingSafeStringEqual(password, adminPassword);

  if (!valid) {
    return NextResponse.json({ error: "गलत उपयोगकर्ता नाम या पासवर्ड" }, { status: 401 });
  }

  const token = await createSessionToken(adminUsername);
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
