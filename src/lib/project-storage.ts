export class ProjectStorage {
  static getActiveProjectId(): number | null {
    if (typeof window === "undefined") return null;
    try {
      const id = localStorage.getItem("if_active_project_id");
      return id ? parseInt(id, 10) : null;
    } catch (e) {
      console.error("Failed to read active project id from localStorage", e);
      return null;
    }
  }

  static setActiveProjectId(id: number): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("if_active_project_id", String(id));
    } catch (e) {
      console.error("Failed to save active project id to localStorage", e);
    }
  }
}
