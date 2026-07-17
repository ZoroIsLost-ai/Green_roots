/**
 * Minimal signed-cookie session for the single admin user.
 * Uses Web Crypto (HMAC-SHA256) so it works in both the Node
 * and Edge runtimes (e.g. inside middleware.ts).
 *
 * Cookie value shape: "<base64url(payload)>.<base64url(signature)>"
 * payload = JSON.stringify({ u: username, exp: <epoch seconds> })
 */

export const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function base64urlEncode(bytes: Uint8Array): string {
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    str.length + ((4 - (str.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function getKey(secret: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(username: string): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");

  const payload = JSON.stringify({
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });

  const key = await getKey(secret);
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));

  const payloadB64 = base64urlEncode(enc.encode(payload));
  const sigB64 = base64urlEncode(new Uint8Array(signature));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;

  try {
    const key = await getKey(secret);
    const payloadBytes = base64urlDecode(payloadB64);
    const sigBytes = base64urlDecode(sigB64);

    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, payloadBytes);
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
