"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Circle,
  Copy,
  ArrowRight,
  FolderOpen,
  Key,
  Code2,
  ShieldCheck,
  TrendingUp,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Create Project", icon: FolderOpen },
  { id: 2, label: "Generate API Key", icon: Key },
  { id: 3, label: "Install Script", icon: Code2 },
  { id: 4, label: "Verify Installation", icon: ShieldCheck },
];

const trackingScript = `<script>
  window.insightflow=window.insightflow||[];
  (function(d){
    var s=d.createElement('script');
    s.async=true;
    s.src='https://cdn.insightflow.io/v1/track.min.js';
    s.setAttribute('data-key','if_live_pk_NEW8xd82kl');
    d.head.appendChild(s);
  })(document);
</script>`;

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [domain, setDomain] = useState("");
  const [apiKey] = useState("if_live_pk_NEW8xd82kl");
  const [copied, setCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyScript = () => {
    navigator.clipboard.writeText(trackingScript);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2000);
  };

  return (
    <AppLayout>
      <Header title="New Project" description="Set up a new analytics project in 4 steps" />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8">
          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-border z-0">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {steps.map((s) => {
                const Icon = s.icon;
                const isCompleted = step > s.id;
                const isCurrent = step === s.id;

                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                        isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCurrent
                          ? "border-primary bg-background text-primary"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-medium whitespace-nowrap",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1: Create Project */}
          {step === 1 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <FolderOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">Create a new project</h2>
                  <p className="text-[13px] text-muted-foreground">
                    Start by giving your project a name and entering your website domain.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Project Name</Label>
                  <Input
                    placeholder="My Awesome App"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="h-10 text-[13px]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This is how the project will appear in InsightFlow.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[13px]">Website Domain</Label>
                  <div className="flex items-center">
                    <div className="flex h-10 items-center rounded-l-md border border-r-0 border-border bg-muted px-3 text-[12px] text-muted-foreground">
                      https://
                    </div>
                    <Input
                      placeholder="yoursite.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="h-10 text-[13px] rounded-l-none"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Enter just the domain, without https:// or trailing slashes.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[13px]">Industry (optional)</Label>
                  <Input
                    placeholder="B2B SaaS, E-Commerce, Blog…"
                    className="h-10 text-[13px]"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!projectName || !domain}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: API Key */}
          {step === 2 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">Your API key is ready</h2>
                  <p className="text-[13px] text-muted-foreground">
                    This key identifies your project. Keep it secure.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-[13px] font-semibold text-emerald-700">
                    API Key generated for {projectName || "your project"}
                  </span>
                </div>
                <p className="text-[12px] text-emerald-600">
                  Domain: <span className="font-mono font-semibold">{domain || "yoursite.com"}</span>
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-[13px]">Production Key</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-border bg-muted/40 px-4 py-3 font-mono text-[13px] text-foreground overflow-x-auto">
                    {apiKey}
                  </div>
                  <button
                    onClick={copyKey}
                    className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-3 hover:bg-muted transition-colors text-[12px]"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-[12px] text-amber-700">
                    <strong>Security note:</strong> Never expose this key in public client-side code directly. Use it only in your tracking script as shown in the next step.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep(1)} className="text-[13px]">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Install Script */}
          {step === 3 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">Install the tracking script</h2>
                  <p className="text-[13px] text-muted-foreground">
                    Add this snippet to the <code className="font-mono bg-muted px-1 rounded text-[12px]">&lt;head&gt;</code> of every page you want to track.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-[#0d1117] border border-border overflow-hidden mb-4">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-gray-400">HTML</span>
                    <span className="text-[10px] text-gray-500">· paste before &lt;/head&gt;</span>
                  </div>
                  <button
                    onClick={copyScript}
                    className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white transition-colors"
                  >
                    {scriptCopied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {scriptCopied ? "Copied!" : "Copy code"}
                  </button>
                </div>
                <pre className="px-4 py-4 text-[12px] font-mono text-gray-300 overflow-x-auto leading-relaxed">
                  <code>{trackingScript}</code>
                </pre>
              </div>

              {/* Framework tabs */}
              <div className="space-y-3">
                <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                  Framework guides
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {["Next.js", "React", "Vue", "Nuxt", "Svelte", "WordPress"].map((fw) => (
                    <button
                      key={fw}
                      className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left flex items-center justify-between"
                    >
                      {fw}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep(2)} className="text-[13px]">
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="gap-2">
                  I've added the script
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Verify */}
          {step === 4 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">Verify installation</h2>
                  <p className="text-[13px] text-muted-foreground">
                    InsightFlow will check your domain for the tracking script.
                  </p>
                </div>
              </div>

              {!verified ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-muted">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">
                          Checking {domain || "yoursite.com"}
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          InsightFlow will ping your site to confirm the tracking script is loaded.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      "Script tag found in page head",
                      "API key matches project configuration",
                      "Network requests verified",
                    ].map((check) => (
                      <div
                        key={check}
                        className="flex items-center gap-2 text-[12px] text-muted-foreground"
                      >
                        <Circle className="h-3.5 w-3.5 shrink-0" />
                        {check}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="ghost" onClick={() => setStep(3)} className="text-[13px]">
                      Back
                    </Button>
                    <Button onClick={handleVerify} disabled={verifying} className="gap-2">
                      {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
                      {verifying ? "Verifying…" : "Verify Installation"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="text-[15px] font-semibold text-emerald-800 mb-1">
                      Installation verified!
                    </h3>
                    <p className="text-[13px] text-emerald-600">
                      InsightFlow is now tracking visitors on{" "}
                      <strong>{domain || "yoursite.com"}</strong>. Analytics will appear within a few minutes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      "Script tag found in page head",
                      "API key matches project configuration",
                      "Network requests verified",
                    ].map((check) => (
                      <div
                        key={check}
                        className="flex items-center gap-2 text-[12px] text-emerald-600"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {check}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
