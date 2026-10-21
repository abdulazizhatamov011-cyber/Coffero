import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/server-session";

/** Who is signed in through Google (read from the signed, httpOnly cookie). */
export async function GET(request: NextRequest) {
  const user = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
}
