"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthStorage } from "@/lib/auth/auth-storage";
import { Sidebar } from "./sidebar";
import { BarChart3 } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const authenticated = typeof window !== "undefined" ? AuthStorage.isAuthenticated() : false;

  useEffect(() => {
    if (!authenticated) {
      router.push("/login");
    }
  }, [authenticated, router]);

  // Render nothing if unauthenticated, to avoid layout shift before redirect
  if (!authenticated) {
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
