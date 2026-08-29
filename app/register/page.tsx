import { redirect } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { registerAction } from "../lib/auth-actions";
import { getCurrentUser } from "../lib/session";

export const metadata = { title: "Create account | Mini Store" };

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "";

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-zinc-900">Create an account</h1>
        <p className="mt-1 mb-6 text-sm text-zinc-500">
          It takes less than a minute.
        </p>

        <AuthForm mode="register" action={registerAction} nextPath={nextPath} />
      </div>
    </main>
  );
}
