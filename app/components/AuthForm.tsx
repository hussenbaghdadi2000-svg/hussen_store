"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "../lib/auth-actions";

type AuthFormProps = {
  mode: "login" | "register";
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  /** Where to send the user after success. Validated on the server. */
  nextPath?: string;
};

const inputClass =
  "w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

export default function AuthForm({
  mode,
  action,
  nextPath = "",
}: AuthFormProps) {
  const isRegister = mode === "register";

  // state = what the action returned, isPending = true while it runs.
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {/* Carried through the form so the server knows where to go next. */}
      <input type="hidden" name="next" value={nextPath} />

      {/* Error that is not tied to one field */}
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      {isRegister && (
        <div>
          <label htmlFor="name" className="text-sm font-medium text-zinc-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={state.values?.name ?? ""}
            className={`mt-1 ${inputClass}`}
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email ?? ""}
          className={`mt-1 ${inputClass}`}
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          className={`mt-1 ${inputClass}`}
        />
        {state.fieldErrors?.password && (
          <p className="mt-1 text-xs text-red-600">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isPending
          ? isRegister
            ? "Creating account..."
            : "Signing in..."
          : isRegister
            ? "Create account"
            : "Sign in"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        {isRegister ? "Already have an account? " : "No account yet? "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-medium text-orange-500 hover:underline"
        >
          {isRegister ? "Sign in" : "Create one"}
        </Link>
      </p>
    </form>
  );
}
