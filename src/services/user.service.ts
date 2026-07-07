import { UserRepository } from "@/repositories/user.repository";
import { UserStorage } from "@/lib/auth/user-storage";
import { components } from "@/generated/openapi";

type UserResponse = components["schemas"]["UserResponse"];
type UpdateUserRequest = components["schemas"]["UpdateUserRequest"];

export class UserService {
  static async getUser(id: number): Promise<UserResponse> {
    const response = await UserRepository.getUserById(id);
    const data = response?.data;
    if (!data) {
      throw new Error(response?.message || "Failed to fetch user");
    }
    UserStorage.saveUser(data);
    return data;
  }

  static async updateUser(id: number, request: UpdateUserRequest): Promise<UserResponse> {
    const response = await UserRepository.updateUser(id, request);
    const data = response?.data;
    if (!data) {
      throw new Error(response?.message || "Failed to update user");
    }
    UserStorage.saveUser(data);
    return data;
  }
}
