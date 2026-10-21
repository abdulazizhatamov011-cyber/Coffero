import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, cookieOptions, encodeSession } from "@/lib/server-session";

/** Step 2: Google sends the user back here with a one-time code; swap it for their profile. */
export async function GET(request: NextRequest) {
  const fail = (reason: string) => {
    const res = NextResponse.redirect(new URL(`/login?error=${reason}`, request.url));
    res.cookies.delete("g_state");
    res.cookies.delete("g_verifier");
    return res;
  };

  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state");
  if (params.get("error")) return fail("google_cancelled");
  if (!code || !state || state !== request.cookies.get("g_state")?.value) return fail("google_state");

  const verifier = request.cookies.get("g_verifier")?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!verifier || !clientId || !clientSecret) return fail("google_config");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });
  if (!tokenRes.ok) {
    console.error("Google token exchange failed:", tokenRes.status, await tokenRes.text());
    return fail("google_token");
  }
  const { access_token } = (await tokenRes.json()) as { access_token?: string };

  const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileRes.ok) return fail("google_profile");
  const profile = (await profileRes.json()) as { name?: string; email?: string; picture?: string; email_verified?: boolean };
  if (!profile.email || profile.email_verified === false) return fail("google_profile");

  const res = NextResponse.redirect(new URL("/login?signed=google", request.url));
  res.cookies.set(
    SESSION_COOKIE,
    encodeSession({ name: profile.name || profile.email.split("@")[0], email: profile.email, picture: profile.picture, provider: "google" }),
    cookieOptions(SESSION_MAX_AGE)
  );
  res.cookies.delete("g_state");
  res.cookies.delete("g_verifier");
  return res;
}
