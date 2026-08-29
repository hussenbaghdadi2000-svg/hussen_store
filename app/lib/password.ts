import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// scrypt uses old-style callbacks; promisify turns it into async/await.
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

/**
 * Turns a plain password into "salt:hash".
 * The salt is random per user, so two people with the same
 * password still end up with completely different hashes.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);

  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Checks a plain password against a stored "salt:hash".
 * Never decrypts anything - it re-hashes the input and compares.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, keyHex] = stored.split(":");

  if (!salt || !keyHex) return false;

  const storedKey = Buffer.from(keyHex, "hex");
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);

  // timingSafeEqual throws if the lengths differ, so check first.
  if (storedKey.length !== derivedKey.length) return false;

  return timingSafeEqual(storedKey, derivedKey);
}
