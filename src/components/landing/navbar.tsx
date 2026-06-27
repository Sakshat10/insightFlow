"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Menu, X, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isScrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground tracking-tight">
          <BarChart3 className="h-4.5 w-4.5 text-primary" />
          <span>InsightFlow</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
            Log In
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "text-[12px] font-medium tracking-tight rounded-md px-3.5 h-8 bg-foreground text-background hover:bg-foreground/95 border-0"
            )}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-b border-border bg-background px-6 py-6 md:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-250">
          <nav className="flex flex-col gap-4">
            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex flex-col gap-2.5 pt-4 border-t border-border/80">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-center"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full justify-center bg-foreground text-background hover:bg-foreground/90 font-medium text-sm rounded-md"
              )}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
