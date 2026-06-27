"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/features/auth";
import { buttonVariants } from "@/components/ui/button";
import { BarChart3, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setValidationError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    registerMutation.mutate(
      { username, email, password },
      {
        onSuccess: () => {
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground tracking-tight mb-8">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="text-lg">InsightFlow</span>
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground text-center">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Validation / API Errors */}
            {(validationError || registerMutation.isError) && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{validationError || registerMutation.error?.message || "Registration failed. Please try again."}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={registerMutation.isPending}
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/80 transition-colors"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={registerMutation.isPending}
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/80 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={registerMutation.isPending}
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/80 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full h-10 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-medium text-sm flex items-center justify-center border-0"
                )}
              >
                {registerMutation.isPending ? "Creating account..." : "Get Started"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
