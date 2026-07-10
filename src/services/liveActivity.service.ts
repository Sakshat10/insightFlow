import { LiveActivityRepository } from "@/repositories/liveActivity.repository";
import { components } from "@/generated/openapi";

type LiveActivityResponse = components["schemas"]["LiveActivityResponse"];

export class LiveActivityService {
  static async getRecentActivity(projectId: number, limit?: number): Promise<LiveActivityResponse[]> {
    const res = await LiveActivityRepository.getRecentActivity(projectId, limit);
    const data = res?.data;
    if (!data) {
      throw new Error(res?.message || "Failed to fetch recent activity");
    }
    return data;
  }
}
