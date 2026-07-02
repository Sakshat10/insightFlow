"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useProjects } from "@/features/projects";
import { FrontProject } from "@/services/project.service";
import { ProjectStorage } from "@/lib/project-storage";

interface ActiveProjectContextType {
  activeProjectId: number | null;
  activeProject: FrontProject | null;
  setActiveProjectId: (id: number) => void;
  projects: FrontProject[];
  isLoading: boolean;
}

const ActiveProjectContext = createContext<ActiveProjectContextType | undefined>(undefined);

export function ActiveProjectProvider({ children }: { children: React.ReactNode }) {
  const { data: projects = [], isLoading } = useProjects();
  const [activeProjectId, setActiveProjectIdState] = useState<number | null>(null);

  // Initialize active project ID from storage or projects list
  useEffect(() => {
    if (isLoading) return;

    const storedId = ProjectStorage.getActiveProjectId();
    if (storedId && projects.some((p) => p.id === storedId)) {
      setActiveProjectIdState(storedId);
    } else if (projects.length > 0) {
      const defaultId = projects[0].id;
      setActiveProjectIdState(defaultId);
      ProjectStorage.setActiveProjectId(defaultId);
    }
  }, [projects, isLoading]);

  const setActiveProjectId = (id: number) => {
    setActiveProjectIdState(id);
    ProjectStorage.setActiveProjectId(id);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  return (
    <ActiveProjectContext.Provider
      value={{
        activeProjectId,
        activeProject,
        setActiveProjectId,
        projects,
        isLoading,
      }}
    >
      {children}
    </ActiveProjectContext.Provider>
  );
}

export function useActiveProject() {
  const context = useContext(ActiveProjectContext);
  if (context === undefined) {
    throw new Error("useActiveProject must be used within an ActiveProjectProvider");
  }
  return context;
}
