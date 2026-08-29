import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { findUserById, toPublicUser, type PublicUser } from "./users";

const SESSION_COOKIE = "session_id";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

type Session = {
  userId: string;
  expiresAt: number; // ms timestamp
};

/**
 * Server-side session store. The browser only ever holds the
 * random session id - never the user id, name, or anything else.
 * A real app puts this in Redis or a database table.
 */
const globalForSessions = globalThis as unknown as {
  sessions?: Map<string, Session>;
};

const sessions = globalForSessions.sessions ?? new Map<string, Session>();
globalForSessions.sessions = sessions;

/** 32 random bytes = 256 bits. Not guessable. */
function newSessionId(): string {
  return randomBytes(32).toString("hex");
}

/** Removes any session rows that have already expired. */
function pruneExpired(): void {
  const now = Date.now();

  for (const [id, session] of sessions) {
    if (session.expiresAt < now) sessions.delete(id);
  }
}

/**
 * Called after a successful login or registration.
 * Only works inside a Server Action or Route Handler,
 * because it writes a cookie.
 */
export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();

  // Session fixation defence: throw away whatever session
  // the visitor arrived with and issue a brand new id.
  const oldSessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (oldSessionId) sessions.delete(oldSessionId);

  pruneExpired();

  const sessionId = newSessionId();
  sessions.set(sessionId, {
    userId,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  });

  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true, // JavaScript in the browser cannot read it
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "lax", // basic CSRF protection
    path: "/", // sent on every route
    maxAge: SESSION_DURATION_MS / 1000, // seconds, not ms
  });
}

/**
 * Reads the session cookie and returns the logged-in user.
 * Safe to call from any Server Component - it only reads.
 */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) return null;

  const session = sessions.get(sessionId);

  // Cookie exists but the server has no such session
  // (server restarted, or the id was forged).
  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  const user = await findUserById(session.userId);

  // Session points at a user that no longer exists.
  if (!user) {
    sessions.delete(sessionId);
    return null;
  }

  return toPublicUser(user);
}

/** Logout: forget the session on the server AND clear the cookie. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) sessions.delete(sessionId);

  cookieStore.delete(SESSION_COOKIE);
}
