import { Hono } from "hono";
import { RegisterUserUseCase } from "../application/usecases/RegisterUserUseCase";
import { LoginUserUseCase } from "../application/usecases/LoginUserUseCase";
import { signInSchema, signupSchema,resetRequestSchema,resetVerifySchema } from "../validators/authValidator";
import { ZodError } from "zod";
import { zValidator } from "@hono/zod-validator";
import  {UserUseCase} from "../../src/application/usecases/usersUseCase";
import { authMiddleware } from "../middleware/authMiddleware";


const userRouter = new Hono();

// Public routes (validation only with zValidator)
userRouter.post("/register", zValidator("json", signupSchema), async (c) => {
  const body = await c.req.valid("json");
  const { utilisateur, adresse, pharmacien, pharmacie } = body;
  const result = await RegisterUserUseCase.execute(utilisateur, adresse, pharmacien, pharmacie);
  return c.json({ success: true, data: result }, 201);
});

userRouter.post("/login", zValidator("json", signInSchema), async (c) => {
  const { email, password } = await c.req.valid("json");
  const result = await LoginUserUseCase.execute(email, password);
  return c.json({ success: true, data: result }, 200);
});

userRouter.post("/reset-password/request", zValidator("json", resetRequestSchema), async (c) => {
  const { email } = await c.req.valid("json");
  const result = await UserUseCase.requestPasswordReset(email);
  return c.json({ success: true, data: result }, 200);
});

userRouter.post("/reset-password/verify", zValidator("json", resetVerifySchema), async (c) => {
  const { userId, otp, newPassword } = await c.req.valid("json");
  const result = await UserUseCase.resetPassword(userId, otp, newPassword);
  return c.json({ success: true, data: result }, 200);
});

// Protected routes (authMiddleware + optional validation)
userRouter.get("/users", authMiddleware, async (c) => {
  const result = await UserUseCase.getAllUsers();
  return c.json({ success: true, data: result }, 200);
});

userRouter.get("/users/:id", authMiddleware, async (c) => {
  const userId = Number(c.req.param("id"));
  const result = await UserUseCase.getUserById(userId);
  return c.json({ success: true, data: result }, 200);
});

userRouter.put("/users/validate/:id", authMiddleware, async (c) => {
  const userId = Number(c.req.param("id"));
  const result = await UserUseCase.validateUser(userId);
  return c.json({ success: true, data: result }, 200);
});

userRouter.put("/users/edit/:id",zValidator("json",signupSchema), async (c) => {
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


// reset passwpord request

userRouter.post("/reset-password/request", zValidator("json", resetRequestSchema), async (c) => {
  const { email } = await c.req.valid("json");
  const result = await UserUseCase.requestPasswordReset(email);
  return c.json({ success: true, data: result }, 200);
});

userRouter.post("/reset-password/verify", zValidator("json", resetVerifySchema), async (c) =>
{
  try {
    const { userId, otp, newPassword } = await c.req.valid("json");
    const result = await UserUseCase.resetPassword(userId, otp, newPassword);
    return c.json({ success: true, data: result }, 200);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      400
    );
 } });
export default userRouter;
