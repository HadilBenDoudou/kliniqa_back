import type { Context } from 'hono';
import { UserService } from '../infrastructure/services/userService';

export const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    // Appeler le service pour connecter l'utilisateur
    const result = await UserService.login(email, password);

    return c.json({ result }, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ message: 'Error logging in', error: errorMessage }, 400);
  }
};
