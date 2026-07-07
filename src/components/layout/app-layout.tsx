"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthStorage } from "@/lib/auth/auth-storage";
import { Sidebar } from "./sidebar";
import { BarChart3 } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authenticated = typeof window !== "undefined" ? AuthStorage.isAuthenticated() : false;

  useEffect(() => {
    if (mounted && !authenticated) {
      router.push("/login");
    }
  }, [mounted, authenticated, router]);

  // Render nothing during SSR or before hydration is complete
  if (!mounted || !authenticated) {
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
