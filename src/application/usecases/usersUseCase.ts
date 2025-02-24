import { UserService } from "../../infrastructure/services/userService";

export class UserUseCase {
  static async getAllUsers() {
    try {
      const users = await UserService.getAllUsers();
      return { users, message: 'Users fetched successfully.' };
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getUserById(userId: number) {
    try {
      const user = await UserService.getUser(userId);
      return { user, message: 'User fetched successfully.' };
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async validateUser(userId: number) {
    try {
      const result = await UserService.validateUser(userId);
      return { message: result.message, pharmacien: result.pharmacien };
    } catch (error) {
      throw new Error(`Failed to validate user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
 
}

  //Edit user profile
  static async editProfile(
    userId: number,
    utilisateurData: Partial<any>,
    adresseData?: Partial<any>,
    pharmacienData?: Partial<any>,
    pharmacieData?: Partial<any>
  ) {
    try {
      const result = await UserService.editProfile(userId, utilisateurData, adresseData, pharmacienData, pharmacieData);
      return { message: result.message, data: result };
    } catch (error) {
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  static async requestPasswordReset(email: string) {
    try {
      const result = await UserService.generateResetOtp(email);
      return { message: result.message, userId: result.userId };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to request password reset: Unknown error"
      );
    }
  }

  static async resetPassword(userId: number, otp: string, newPassword: string) {
    try {
      const result = await UserService.resetPassword(userId, otp, newPassword);
      return { message: result.message };
    } catch (error) {
      // Pass through the specific error message from UserService without wrapping it unnecessarily
      throw new Error(
        error instanceof Error ? error.message : "Failed to reset password: Unknown error"
      );
    }
  }
  
}
