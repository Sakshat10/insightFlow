"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth";
import { buttonVariants } from "@/components/ui/button";
import { BarChart3, AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!username.trim() || !password.trim()) {
      setValidationError("Username/Email and Password are required.");
      return;
    }

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          router.push("/dashboard");
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Or{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Validation / API Errors */}
            {(validationError || loginMutation.isError) && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{validationError || loginMutation.error?.message || "Invalid credentials. Please try again."}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loginMutation.isPending}
                className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/80 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Forgot password functionality placeholder")}
                  className="text-xs font-medium text-primary hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                  className="block w-full rounded-lg border border-border bg-background pl-3 pr-9 py-2 text-sm text-foreground outline-none focus:border-primary/80 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer p-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full h-10 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-medium text-sm flex items-center justify-center border-0"
                )}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
