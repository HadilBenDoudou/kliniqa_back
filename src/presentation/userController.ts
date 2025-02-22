// src/controllers/UserController.ts
// src/controllers/UserController.ts
import type { Context } from 'hono';
import { RegisterUserUseCase } from "../application/usecases/RegisterUserUseCase";
import { LoginUserUseCase } from "../application/usecases/LoginUserUseCase";

export const registerUser = async (c: Context) => {
  try {
    const userData = await c.req.json();
    const { utilisateur, adresse, pharmacien, pharmacie } = userData;

    if (!utilisateur?.email || !utilisateur?.password) {
      return c.json({ message: 'Invalid request: Missing required fields' }, 400);
    }

    // Execute RegisterUserUseCase
    const result = await RegisterUserUseCase.execute(utilisateur, adresse, pharmacien, pharmacie);
    return c.json({ result }, 201);
  } catch (error) {
    return c.json({ message: 'Error registering user', error: error instanceof Error ? error.message : 'Unknown error' }, 400);
  }
};

export const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    // Execute LoginUserUseCase
    const result = await LoginUserUseCase.execute(email, password);
    return c.json({ result }, 200);
  } catch (error) {
    return c.json({ message: 'Error logging in', error: error instanceof Error ? error.message : 'Unknown error' }, 400);
  }
};
