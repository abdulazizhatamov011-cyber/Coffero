"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Demo accounts that live in this browser (localStorage).
 * Passwords are salted + SHA-256 hashed, never stored as plain text.
 * Google sign-in is real (see /api/auth/google); its profile is mirrored here so it can be edited.
 */

type StoredUser = {
  name: string;
  email: string;
  provider?: "google";
  salt?: string;
  hash?: string;
  createdAt?: number;
  favorite?: number;
};
export type Session = { name: string; email: string; provider?: "google"; since?: number; favorite?: number };
export type AuthError =
  | "auth.err.exists" | "auth.err.invalid" | "auth.err.match" | "auth.err.short"
  | "auth.err.name" | "auth.err.email" | "auth.err.current";

const USERS = "coffero.users";
const SESSION = "coffero.session";
const listeners = new Set<() => void>();

const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* storage blocked: the session simply won't persist */ }
  listeners.forEach((f) => f());
};

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === SESSION) cb(); };
  addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); removeEventListener("storage", onStorage); };
}

/** Current signed-in user, or null. */
export function useSession(): Session | null {
  const raw = useSyncExternalStore(subscribe, () => read(SESSION), () => null);
  return useMemo(() => {
    if (!raw) return null;
    try { return JSON.parse(raw) as Session; } catch { return null; }
  }, [raw]);
}

const users = (): StoredUser[] => { try { return JSON.parse(read(USERS) ?? "[]"); } catch { return []; } };
const saveUsers = (list: StoredUser[]) => write(USERS, JSON.stringify(list));
const currentSession = (): Session | null => { try { return JSON.parse(read(SESSION) ?? "null"); } catch { return null; } };
const norm = (email: string) => email.trim().toLowerCase();
export const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const toSession = (u: StoredUser): Session => ({
  name: u.name, email: u.email, provider: u.provider, since: u.createdAt, favorite: u.favorite,
});
const startSession = (u: StoredUser) => { const s = toSession(u); write(SESSION, JSON.stringify(s)); return s; };

async function hash(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function signUp(name: string, email: string, password: string, confirm: string): Promise<AuthError | Session> {
  if (!name.trim()) return "auth.err.name";
  if (!validEmail(email)) return "auth.err.email";
  if (password.length < 6) return "auth.err.short";
  if (password !== confirm) return "auth.err.match";
  const list = users();
  if (list.some((u) => u.email === norm(email))) return "auth.err.exists";
  const salt = crypto.randomUUID();
  const user: StoredUser = { name: name.trim(), email: norm(email), salt, hash: await hash(password, salt), createdAt: Date.now() };
  saveUsers([...list, user]);
  return startSession(user);
}

export async function signIn(email: string, password: string): Promise<AuthError | Session> {
  if (!validEmail(email)) return "auth.err.email";
  const user = users().find((u) => u.email === norm(email));
  // Google accounts have no password here — they sign in with the Google button
  if (!user?.salt || !user.hash || (await hash(password, user.salt)) !== user.hash) return "auth.err.invalid";
  return startSession(user);
}

export function signOut() {
  write(SESSION, null);
  // also clear the server cookie left by "Sign in with Google"
  fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
}

/** Picks up a Google sign-in from the server cookie and mirrors it into the local profile. */
export async function syncGoogleSession() {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const { user } = (await res.json()) as { user: { name: string; email: string } | null };
    if (!user) return;
    const list = users();
    let record = list.find((u) => u.email === norm(user.email));
    if (!record) {
      record = { name: user.name, email: norm(user.email), provider: "google", createdAt: Date.now() };
      saveUsers([...list, record]);
    }
    startSession(record);
  } catch { /* offline or no server — ignore */ }
}

/** Updates the signed-in user's name and/or favourite drink. */
export function updateProfile(patch: { name?: string; favorite?: number }): AuthError | null {
  const session = currentSession();
  if (!session) return null;
  if (patch.name !== undefined && !patch.name.trim()) return "auth.err.name";
  const list = users();
  const user = list.find((u) => u.email === session.email);
  if (user) {
    if (patch.name !== undefined) user.name = patch.name.trim();
    if (patch.favorite !== undefined) user.favorite = patch.favorite;
    saveUsers(list);
    startSession(user);
  } else {
    write(SESSION, JSON.stringify({ ...session, ...patch, name: patch.name?.trim() ?? session.name }));
  }
  return null;
}

export async function changePassword(current: string, next: string, confirm: string): Promise<AuthError | null> {
  const session = currentSession();
  const list = users();
  const user = list.find((u) => u.email === session?.email);
  if (!user?.salt || !user.hash) return "auth.err.invalid";
  if ((await hash(current, user.salt)) !== user.hash) return "auth.err.current";
  if (next.length < 6) return "auth.err.short";
  if (next !== confirm) return "auth.err.match";
  user.salt = crypto.randomUUID();
  user.hash = await hash(next, user.salt);
  saveUsers(list);
  return null;
}
