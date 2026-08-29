import { randomUUID } from "node:crypto";
import { hashPassword, verifyPassword } from "./password";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

// What we are allowed to send to the browser: NEVER the hash.
export type PublicUser = Pick<User, "id" | "name" | "email">;

/**
 * In-memory store. Next.js reloads modules on every edit in dev,
 * which would wipe this - so we hang it off globalThis to survive.
 * A real app replaces this file with a database.
 */
const globalForUsers = globalThis as unknown as {
  usersByEmail?: Map<string, User>;
};

const usersByEmail =
  globalForUsers.usersByEmail ?? new Map<string, User>();
globalForUsers.usersByEmail = usersByEmail;

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

// Adds a demo account the first time the store is touched.
async function ensureSeeded(): Promise<void> {
  if (usersByEmail.size > 0) return;

  const email = "demo@ministore.com";
  usersByEmail.set(email, {
    id: randomUUID(),
    name: "Demo User",
    email,
    passwordHash: await hashPassword("demo1234"),
    createdAt: new Date(),
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureSeeded();
  return usersByEmail.get(normaliseEmail(email)) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  await ensureSeeded();

  for (const user of usersByEmail.values()) {
    if (user.id === id) return user;
  }

  return null;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  await ensureSeeded();

  const email = normaliseEmail(input.email);

  if (usersByEmail.has(email)) {
    throw new Error("EMAIL_TAKEN");
  }

  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date(),
  };

  usersByEmail.set(email, user);
  return user;
}

/**
 * Returns the user if the password matches, otherwise null.
 * Always runs a hash comparison, even when the email does not
 * exist, so an attacker cannot tell the difference by timing.
 */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await findUserByEmail(email);

  if (!user) {
    // Dummy work so a missing email takes as long as a wrong password.
    await verifyPassword(password, `${"0".repeat(32)}:${"0".repeat(128)}`);
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  return isValid ? user : null;
}
