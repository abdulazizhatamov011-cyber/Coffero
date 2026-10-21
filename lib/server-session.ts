import { createHmac, timingSafeEqual } from "node:crypto";

/** Signed login cookie for users who signed in through Google (server side only). */

export const SESSION_COOKIE = "coffero_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type GoogleUser = { name: string; email: string; picture?: string; provider: "google" };

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is missing — add it to .env.local");
  return s;
}

const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function encodeSession(user: GoogleUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + SESSION_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): GoogleUser | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { name: data.name, email: data.email, picture: data.picture, provider: "google" };
  } catch {
    return null;
  }
}

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge,
});
