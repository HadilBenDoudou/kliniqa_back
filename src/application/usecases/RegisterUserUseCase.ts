import { UserService } from "../../infrastructure/services/userService"; // Use the service layer
import { adresseSchema, pharmacienSchema, pharmacieValidator } from "../../validators/authValidator";

export class RegisterUserUseCase {
  static async execute(utilisateurData: any, adresseData: any, pharmacienData: any, pharmacieData: any) {
    try {
      // Validate data before processing (optional)
      adresseSchema.parse(adresseData);
      pharmacienSchema.parse(pharmacienData);
      pharmacieValidator.parse(pharmacieData);

      // Call service to register user
      const result = await UserService.register(utilisateurData, adresseData, pharmacienData, pharmacieData);
      
      return result;
    } catch (error) {
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
