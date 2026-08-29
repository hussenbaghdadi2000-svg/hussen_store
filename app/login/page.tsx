import { redirect } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { loginAction } from "../lib/auth-actions";
import { getCurrentUser } from "../lib/session";

export const metadata = { title: "Sign in | Mini Store" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  // Already logged in? No reason to show the form.
  const user = await getCurrentUser();
  if (user) redirect("/account");

  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "";

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
        <p className="mt-1 mb-6 text-sm text-zinc-500">
          Sign in to your MiniStore account.
        </p>

        {nextPath && (
          <p className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            Please sign in to continue.
          </p>
        )}

        <AuthForm mode="login" action={loginAction} nextPath={nextPath} />

        <p className="mt-6 rounded-lg bg-zinc-50 p-3 text-center text-xs text-zinc-500">
          Demo account: <strong>demo@ministore.com</strong> / <strong>demo1234</strong>
        </p>
      </div>
    </main>
  );
}
