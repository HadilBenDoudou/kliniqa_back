// src/usecases/LoginUserUseCase.ts
import { UserService } from "../../infrastructure/services/userService"; // Use the service layer

export class LoginUserUseCase {
  static async execute(email: string, password: string) {
    try {
      // Call service to log in user
      const result = await UserService.login(email, password);
      
      return result;
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
