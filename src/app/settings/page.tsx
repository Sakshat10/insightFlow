"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthStorage } from "@/lib/auth/auth-storage";
import { UserService } from "@/services/user.service";
import { ProjectService } from "@/services/project.service";
import { useActiveProject } from "@/providers/ActiveProjectProvider";
import { components } from "@/generated/openapi";
import {
  Settings,
  User,
  Check,
  AlertCircle,
  Shield,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

type UserResponse = components["schemas"]["UserResponse"];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("project");
  const { activeProjectId, setActiveProjectId, projects } = useActiveProject();

  // Project Settings State
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectSaved, setProjectSaved] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("");
  const [timezone, setTimezone] = useState("");

  // User/Profile State
  const [user, setUser] = useState<UserResponse | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [userSuccess, setUserSuccess] = useState(false);

  // Fetch Project Settings
  useEffect(() => {
    if (activeProjectId) {
      setIsLoadingProject(true);
      setProjectError(null);
      ProjectService.getProjectSettings(activeProjectId)
        .then((settings) => {
          setProjectName(settings.projectName || "");
          setDomain(settings.domain || "");
          setIndustry(settings.industry || "");
          setTimezone(settings.timezone || "");
        })
        .catch((err) => {
          console.error(err);
          setProjectError("Failed to load project settings.");
        })
        .finally(() => {
          setIsLoadingProject(false);
        });
    }
  }, [activeProjectId]);

  // Fetch User/Profile Settings
  useEffect(() => {
    const currentUser = AuthStorage.getCurrentUser();
    if (currentUser?.id) {
      setIsLoadingUser(true);
      UserService.getUser(currentUser.id)
        .then((data) => {
          setUser(data);
          setEmail(data.email || "");
          setUserError(null);
        })
        .catch((err) => {
          console.error(err);
          setUser(currentUser);
          setEmail(currentUser.email || "");
        })
        .finally(() => {
          setIsLoadingUser(false);
        });
    }
  }, []);

  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId) return;

    setIsSavingProject(true);
    setProjectError(null);
    setProjectSaved(false);

    try {
      await ProjectService.updateProjectSettings(activeProjectId, {
        projectName,
        domain,
        industry,
        timezone,
      });
      setProjectSaved(true);
      setTimeout(() => setProjectSaved(false), 3000);
    } catch (err: any) {
      setProjectError(err?.message || "Failed to update project settings.");
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleProjectDelete = async () => {
    if (!activeProjectId) return;
    if (!confirm("Are you sure you want to permanently delete this project? This will delete all associated analytics data and cannot be undone.")) {
      return;
    }

    setIsDeletingProject(true);
    setProjectError(null);

    try {
      await ProjectService.deleteProject(activeProjectId);
      
      // Determine next project to select
      const remainingProjects = projects.filter((p) => p.id !== activeProjectId);
      if (remainingProjects.length > 0) {
        setActiveProjectId(remainingProjects[0].id);
      } else {
        // Clear active project
        localStorage.removeItem("activeProjectId");
      }
      
      router.push("/projects");
    } catch (err: any) {
      setProjectError(err?.message || "Failed to delete project.");
    } finally {
      setIsDeletingProject(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSavingUser(true);
    setUserError(null);
    setUserSuccess(false);

    try {
      const payload: { email: string; password?: string } = { email };
      if (password) {
        payload.password = password;
      }
      const updatedUser = await UserService.updateUser(user.id, payload);
      setUser(updatedUser);
      setPassword("");
      setUserSuccess(true);
      setTimeout(() => setUserSuccess(false), 3000);
    } catch (err: any) {
      setUserError(err?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSavingUser(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AppLayout>
      <Header title="Settings" description="Manage project and account settings" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="h-9 bg-muted/60 p-1 gap-0.5">
              <TabsTrigger value="project" className="flex items-center gap-1.5 text-[12px] h-7 px-3">
                <Settings className="h-3.5 w-3.5" />
                Project
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1.5 text-[12px] h-7 px-3">
                <User className="h-3.5 w-3.5" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* Project Settings */}
            <TabsContent value="project" className="space-y-5 mt-0">
              {isLoadingProject ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <form onSubmit={handleProjectSave} className="space-y-5">
                  {projectError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 flex items-center gap-2 text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{projectError}</span>
                    </div>
                  )}

                  {projectSaved && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 flex items-center gap-2 text-xs text-emerald-600">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Project settings updated successfully!</span>
                    </div>
                  )}

                  <CardSection
                    title="Project Details"
                    description="Basic information about your analytics project"
                    actions={
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSavingProject}
                        className="h-7 text-[12px] gap-1.5"
                      >
                        {isSavingProject ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Saving...
                          </>
                        ) : projectSaved ? (
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
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          required
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
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            required
                            className="h-9 text-[13px] rounded-l-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[12px]">Industry</Label>
                        <Input
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="h-9 text-[13px]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[12px]">Timezone</Label>
                        <Input
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="h-9 text-[13px]"
                        />
                      </div>
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
                            Permanently delete this project and all its data. This cannot be undone.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={isDeletingProject}
                          onClick={handleProjectDelete}
                          className="h-8 gap-1.5 text-[12px] flex-shrink-0 ml-4"
                        >
                          {isDeletingProject ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Delete Project
                        </Button>
                      </div>
                    </div>
                  </CardSection>
                </form>
              )}
            </TabsContent>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-5 mt-0">
              {isLoadingUser ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <form onSubmit={handleProfileSave} className="space-y-5">
                  {userError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 flex items-center gap-2 text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{userError}</span>
                    </div>
                  )}

                  {userSuccess && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 flex items-center gap-2 text-xs text-emerald-600">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}

                  <CardSection
                    title="Profile Details"
                    description="Personal information and account settings"
                    actions={
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSavingUser}
                        className="h-7 text-[12px] gap-1.5"
                      >
                        {isSavingUser ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Saving...
                          </>
                        ) : userSuccess ? (
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
                        <Label className="text-[12px]">Username</Label>
                        <Input
                          value={user?.username || ""}
                          disabled
                          className="h-9 text-[13px] bg-muted/50 cursor-not-allowed"
                        />
                        <p className="text-[11px] text-muted-foreground">Username cannot be changed.</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[12px]">Email Address</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-9 text-[13px]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[12px]">Account Role</Label>
                        <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted/30 text-[13px] font-medium text-foreground">
                          <Shield className="h-4 w-4 text-violet-500" />
                          <span>{user?.role || "USER"}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[12px]">Member Since</Label>
                        <Input
                          value={formatDate(user?.createdAt)}
                          disabled
                          className="h-9 text-[13px] bg-muted/50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </CardSection>

                  <CardSection
                    title="Security"
                    description="Update your password to secure your account"
                  >
                    <div className="max-w-sm space-y-1.5">
                      <Label className="text-[12px]">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-9 text-[13px] pr-9"
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
                      <p className="text-[11px] text-muted-foreground">Leave blank to keep your current password.</p>
                    </div>
                  </CardSection>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
