import type { Context, Next } from 'hono';
import { ZodError, ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    schema.parse(body);
    c.set('validatedData', body);
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ message: "Invalid request", error: error.errors }, 400);
    }
    return c.json({ message: "Invalid request", error: (error as Error).message }, 400);
  }
};
