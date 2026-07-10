import { ConversionGoalRepository } from "@/repositories/conversionGoal.repository";
import { components } from "@/generated/openapi";

type ConversionGoalResponse = components["schemas"]["ConversionGoalResponse"];
type DailyConversionResponse = components["schemas"]["DailyConversionResponse"];
type CreateConversionGoalRequest = components["schemas"]["CreateConversionGoalRequest"];
type UpdateConversionGoalRequest = components["schemas"]["UpdateConversionGoalRequest"];

export class ConversionGoalService {
  static async getConversionGoals(projectId: number): Promise<ConversionGoalResponse[]> {
    const res = await ConversionGoalRepository.getConversionGoals(projectId);
    const data = res?.data;
    if (!data) {
      throw new Error(res?.message || "Failed to fetch conversion goals");
    }
    return data;
  }

  static async getConversionGoalById(id: number): Promise<ConversionGoalResponse> {
    const res = await ConversionGoalRepository.getConversionGoalById(id);
    const data = res?.data;
    if (!data) {
      throw new Error(res?.message || "Failed to fetch conversion goal");
    }
    return data;
  }

  static async createConversionGoal(request: CreateConversionGoalRequest): Promise<ConversionGoalResponse> {
    const res = await ConversionGoalRepository.createConversionGoal(request);
    const data = res?.data;
    if (!data) {
      throw new Error(res?.message || "Failed to create conversion goal");
    }
    return data;
  }

  static async updateConversionGoal(id: number, request: UpdateConversionGoalRequest): Promise<ConversionGoalResponse> {
    const res = await ConversionGoalRepository.updateConversionGoal(id, request);
    const data = res?.data;
    if (!data) {
      throw new Error(res?.message || "Failed to update conversion goal");
    }
    return data;
  }

  static async deactivateConversionGoal(id: number): Promise<ConversionGoalResponse> {
    const res = await ConversionGoalRepository.deactivateConversionGoal(id);
    const data = res?.data;
    if (!data) {
      throw new Error(res?.message || "Failed to deactivate conversion goal");
    }
    return data;
  }

  static async getConversionAnalytics(projectId: number, days?: number): Promise<DailyConversionResponse[]> {
    const res = await ConversionGoalRepository.getConversionAnalytics(projectId, days);
    const data = res?.data;
    if (!data) {
      throw new Error(res?.message || "Failed to fetch conversion analytics");
    }
    return data;
  }
}
