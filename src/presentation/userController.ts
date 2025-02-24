import { Hono } from "hono";
import { RegisterUserUseCase } from "../application/usecases/RegisterUserUseCase";
import { LoginUserUseCase } from "../application/usecases/LoginUserUseCase";
import { signInSchema, signupSchema } from "../validators/authValidator";
import { ZodError } from "zod";
import { zValidator } from "@hono/zod-validator";
import  {UserUseCase} from "../../src/application/usecases/usersUseCase";
const userRouter = new Hono();

userRouter.post("/register", zValidator("json", signupSchema), async (c) => {
  try {
    const body = await c.req.valid("json");
    const { utilisateur, adresse, pharmacien, pharmacie } = body;
    const result = await RegisterUserUseCase.execute(utilisateur, adresse, pharmacien, pharmacie);
    return c.json({ success: true, data: result }, 201);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      400
    );
  }
});


userRouter.post("/login", zValidator("json", signInSchema), async (c) => {
  try {
    const { email, password } = await c.req.valid("json");
    const result = await LoginUserUseCase.execute(email, password);
    return c.json({ success: true, data: result }, 200);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      400
    );
  }
});
// Get all users
userRouter.get("/users", async (c) => {
  try {
    const result = await UserUseCase.getAllUsers();
    return c.json({ success: true, data: result }, 200);
  } catch (err: unknown) {
    return c.json({ error: err instanceof Error ? err.message : "Unknown error" }, 400);
  }
});
//get user by id
userRouter.get("/users/:id", async (c) => {
  try {
    const userId = Number(c.req.param("id"));
    const result = await UserUseCase.getUserById(userId);
    return c.json({ success: true, data: result }, 200);
  } catch (err: unknown) {
    return c.json({ error: err instanceof Error ? err.message : "Unknown error" }, 400);
  }
});

// Validate user (admin)
userRouter.put("/users/validate/:id", async (c) => {
  try {
    const userId = Number(c.req.param("id"));
    const result = await UserUseCase.validateUser(userId);
    return c.json({ success: true, data: result }, 200);
  } catch (err: unknown) {
    return c.json({ error: err instanceof Error ? err.message : "Unknown error" }, 400);
  }
});
// Edit user profile
userRouter.put("/users/edit/:id", async (c) => {
  try {
    const userId = Number(c.req.param("id"));
    const body = await c.req.json();
    const { utilisateur, adresse, pharmacien, pharmacie } = body;
    const result = await UserUseCase.editProfile(userId, utilisateur, adresse, pharmacien, pharmacie);
    return c.json({ success: true, data: result }, 200);
  } catch (err: unknown) {
    return c.json({ error: err instanceof Error ? err.message : "Unknown error" }, 400);
  }
});
// Request OTP for password reset
userRouter.post("/password-reset/request", async (c) => {
  try {
    const { email } = await c.req.json();
    const result = await UserUseCase.requestPasswordReset(email);
    return c.json({ success: true, data: result }, 200);
  } catch (err: unknown) {
    return c.json({ error: err instanceof Error ? err.message : "Unknown error" }, 400);
  }
});

// Reset password using OTP


export default userRouter;
