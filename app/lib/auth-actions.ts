"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "./session";
import { createUser, verifyCredentials } from "./users";

// Shape returned to the form so it can show errors.
export type AuthState = {
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
  };
  values?: {
    name?: string;
    email?: string;
  };
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_REDIRECT = "/account";

/**
 * Only allow redirects to paths inside our own site.
 * Without this, ?next=https://evil.com would turn our login
 * page into a phishing redirector (an "open redirect").
 */
function safeRedirectPath(value: string): string {
  if (!value.startsWith("/")) return DEFAULT_REDIRECT; // absolute URL
  if (value.startsWith("//")) return DEFAULT_REDIRECT; // //evil.com
  if (value.includes("\\")) return DEFAULT_REDIRECT; // backslash tricks
  return value;
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: AuthState["fieldErrors"] = {};

  if (!email) fieldErrors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email";

  if (!password) fieldErrors.password = "Password is required";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { email } };
  }

  const user = await verifyCredentials(email, password);

  // Deliberately vague: never reveal whether the email exists.
  if (!user) {
    return { error: "Invalid email or password", values: { email } };
  }

  await createSession(user.id);

  const next = safeRedirectPath(String(formData.get("next") ?? ""));

  // redirect() throws internally - it must be OUTSIDE any try/catch.
  redirect(next);
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: AuthState["fieldErrors"] = {};

  if (name.length < 2) fieldErrors.name = "Name must be at least 2 characters";

  if (!email) fieldErrors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email";

  if (password.length < 8)
    fieldErrors.password = "Password must be at least 8 characters";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { name, email } };
  }

  let userId: string;

  try {
    const user = await createUser({ name, email, password });
    userId = user.id;
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return {
        fieldErrors: { email: "That email is already registered" },
        values: { name, email },
      };
    }
    throw error;
  }

  await createSession(userId);

  const next = safeRedirectPath(String(formData.get("next") ?? ""));

  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
