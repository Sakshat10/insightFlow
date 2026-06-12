"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { teamMembers, currentProject } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Users,
  Bell,
  CreditCard,
  Globe,
  Shield,
  Trash2,
  UserPlus,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  Owner: { label: "Owner", color: "text-violet-700", bg: "bg-violet-50" },
  Admin: { label: "Admin", color: "text-blue-700", bg: "bg-blue-50" },
  Analyst: { label: "Analyst", color: "text-emerald-700", bg: "bg-emerald-50" },
  Viewer: { label: "Viewer", color: "text-gray-600", bg: "bg-gray-100" },
};

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppLayout>
      <Header title="Settings" description="Manage project and account settings" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Tabs defaultValue="project" className="space-y-6">
            <TabsList className="h-9 bg-muted/60 p-1 gap-0.5">
              {[
                { value: "project", label: "Project", icon: Settings },
                { value: "team", label: "Team", icon: Users },
                { value: "notifications", label: "Notifications", icon: Bell },
                { value: "billing", label: "Billing", icon: CreditCard },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-1.5 text-[12px] h-7 px-3"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Project Settings */}
            <TabsContent value="project" className="space-y-5 mt-0">
              <CardSection
                title="Project Details"
                description="Basic information about your analytics project"
                actions={
                  <Button
                    size="sm"
                    className="h-7 text-[12px] gap-1.5"
                    onClick={handleSave}
                  >
                    {saved ? (
                      <>
                        <Check className="h-3 w-3" />
                        Saved
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                }
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Project Name</Label>
                    <Input
                      defaultValue={currentProject.name}
                      className="h-9 text-[13px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Website Domain</Label>
                    <div className="flex items-center">
                      <div className="flex h-9 items-center rounded-l-md border border-r-0 border-border bg-muted px-3 text-[12px] text-muted-foreground">
                        https://
                      </div>
                      <Input
                        defaultValue={currentProject.domain}
                        className="h-9 text-[13px] rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Industry</Label>
                    <Input
                      defaultValue={currentProject.industry}
                      className="h-9 text-[13px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Timezone</Label>
                    <Input
                      defaultValue={currentProject.timezone}
                      className="h-9 text-[13px]"
                    />
                  </div>
                </div>
              </CardSection>

              <CardSection
                title="Tracking Configuration"
                description="Control what data InsightFlow collects"
              >
                <div className="space-y-4">
                  {[
                    {
                      title: "Pageview Tracking",
                      description: "Automatically track every page visit",
                      defaultChecked: true,
                    },
                    {
                      title: "Session Recording",
                      description: "Capture full user sessions (requires consent)",
                      defaultChecked: false,
                    },
                    {
                      title: "IP Anonymization",
                      description: "Mask the last octet of visitor IP addresses",
                      defaultChecked: true,
                    },
                    {
                      title: "Bot Filtering",
                      description: "Exclude known bot and crawler traffic",
                      defaultChecked: true,
                    },
                    {
                      title: "Cross-Domain Tracking",
                      description: "Track visitors across multiple subdomains",
                      defaultChecked: false,
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{item.title}</p>
                        <p className="text-[12px] text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked={item.defaultChecked} />
                    </div>
                  ))}
                </div>
              </CardSection>

              <CardSection
                title="Danger Zone"
                description="Irreversible actions for your project"
              >
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Delete Project</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        Permanently delete acme.com and all its data. This cannot be undone.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 gap-1.5 text-[12px] flex-shrink-0 ml-4"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Project
                    </Button>
                  </div>
                </div>
              </CardSection>
            </TabsContent>

            {/* Team Members */}
            <TabsContent value="team" className="space-y-5 mt-0">
              <CardSection
                title="Team Members"
                description={`${teamMembers.length} members with access to acme.com`}
                actions={
                  <Button size="sm" className="h-7 text-[12px] gap-1.5">
                    <UserPlus className="h-3.5 w-3.5" />
                    Invite member
                  </Button>
                }
                noPadding
              >
                <div className="divide-y divide-border">
                  {teamMembers.map((member) => {
                    const role = roleConfig[member.role] || roleConfig.Viewer;
                    return (
                      <div key={member.id} className="flex items-center gap-3 px-4 py-3.5">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[11px] font-semibold">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-foreground">
                              {member.name}
                            </span>
                            {member.role === "Owner" && (
                              <Shield className="h-3.5 w-3.5 text-violet-500" />
                            )}
                          </div>
                          <p className="text-[12px] text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-[11px] text-muted-foreground hidden md:block">
                            {member.lastActive}
                          </span>
                          <StatusBadge status={member.status} />
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                              role.bg,
                              role.color
                            )}
                          >
                            {role.label}
                          </span>
                          {member.role !== "Owner" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[12px] text-muted-foreground"
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardSection>

              <CardSection
                title="Invite by Email"
                description="Send an invite link to a new team member"
              >
                <div className="flex gap-2">
                  <Input
                    placeholder="colleague@acme.com"
                    className="h-9 text-[13px] max-w-sm"
                    type="email"
                  />
                  <Button size="sm" className="h-9 text-[12px]">
                    Send Invite
                  </Button>
                </div>
              </CardSection>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-5 mt-0">
              <CardSection title="Email Notifications" description="Choose what to receive in your inbox">
                <div className="space-y-4">
                  {[
                    { title: "Weekly Summary", description: "Get a weekly performance digest every Monday", checked: true },
                    { title: "Monthly Report", description: "Receive detailed monthly analytics report", checked: true },
                    { title: "Conversion Alerts", description: "Alert when conversion rate drops below 3%", checked: true },
                    { title: "Traffic Spikes", description: "Notify when traffic increases by 2x or more", checked: false },
                    { title: "New Signup Events", description: "Email on each new user signup (high volume)", checked: false },
                    { title: "Billing Alerts", description: "Receive billing and plan usage notifications", checked: true },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{item.title}</p>
                        <p className="text-[12px] text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked={item.checked} />
                    </div>
                  ))}
                </div>
              </CardSection>

              <CardSection title="Alert Thresholds" description="Set conditions for automated alerts">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Conversion Rate Alert (below)</Label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="3" className="h-9 text-[13px] w-24" type="number" />
                      <span className="text-[13px] text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Bounce Rate Alert (above)</Label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="60" className="h-9 text-[13px] w-24" type="number" />
                      <span className="text-[13px] text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              </CardSection>
            </TabsContent>

            {/* Billing */}
            <TabsContent value="billing" className="space-y-5 mt-0">
              <div className="rounded-lg border border-border bg-gradient-to-br from-indigo-50 to-blue-50 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                      Current Plan
                    </span>
                    <h3 className="text-[20px] font-bold text-foreground mt-2">Growth Plan</h3>
                    <p className="text-[13px] text-muted-foreground">
                      $299 / month · Billed monthly · Next renewal Jun 15, 2025
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-[12px]">
                    Upgrade Plan
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: "Monthly Events", value: "50,000", limit: "/ 200,000" },
                    { label: "Projects", value: "4", limit: "/ 10" },
                    { label: "Team Members", value: "4", limit: "/ 15" },
                    { label: "Data Retention", value: "12 months", limit: "" },
                  ].map((usage) => (
                    <div key={usage.label}>
                      <p className="text-[11px] text-muted-foreground">{usage.label}</p>
                      <p className="text-[14px] font-semibold text-foreground">
                        {usage.value}
                        {usage.limit && (
                          <span className="text-[12px] font-normal text-muted-foreground ml-1">{usage.limit}</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <CardSection title="Available Plans" description="Choose the plan that fits your needs">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {[
                    {
                      name: "Starter",
                      price: "$79",
                      description: "For small teams getting started",
                      features: ["10,000 events/mo", "3 projects", "5 team members", "3-month retention"],
                      current: false,
                    },
                    {
                      name: "Growth",
                      price: "$299",
                      description: "For growing companies",
                      features: ["200,000 events/mo", "10 projects", "15 team members", "12-month retention"],
                      current: true,
                    },
                    {
                      name: "Enterprise",
                      price: "Custom",
                      description: "For large-scale deployments",
                      features: ["Unlimited events", "Unlimited projects", "SSO & SAML", "Custom retention"],
                      current: false,
                    },
                  ].map((plan) => (
                    <div
                      key={plan.name}
                      className={cn(
                        "rounded-lg border p-4",
                        plan.current
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[14px] font-semibold text-foreground">{plan.name}</h4>
                        {plan.current && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[20px] font-bold text-foreground">
                        {plan.price}
                        {plan.price !== "Custom" && (
                          <span className="text-[13px] font-normal text-muted-foreground">/mo</span>
                        )}
                      </p>
                      <p className="text-[12px] text-muted-foreground mb-3">{plan.description}</p>
                      <ul className="space-y-1.5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-[12px] text-foreground">
                            <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {!plan.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 h-8 text-[12px]"
                        >
                          {plan.price === "Custom" ? "Contact Sales" : "Upgrade"}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardSection>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
