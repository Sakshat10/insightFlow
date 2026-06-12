import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <TrendingUp className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-[48px] font-bold text-foreground leading-none tabular-nums mb-2">
          404
        </h1>
        <p className="text-[15px] font-medium text-foreground mb-1">
          Page not found
        </p>
        <p className="text-[13px] text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
