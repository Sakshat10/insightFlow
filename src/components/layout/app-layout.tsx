"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth";
import { Sidebar } from "./sidebar";
import { BarChart3 } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    // If loading completes and no user is resolved or an error occurs, redirect to login
    if (!isLoading && (isError || !user)) {
      router.push("/login");
    }
  }, [user, isLoading, isError, router]);

  // Loading screen matching dashboard design system
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <BarChart3 className="h-8 w-8 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground font-medium">Checking session...</span>
        </div>
      </div>
    );
  }

  // If loading has ended and user is unauthenticated, render empty state while redirecting
  if (isError || !user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
