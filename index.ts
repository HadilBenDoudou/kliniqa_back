// src/app.ts
import { Hono } from 'hono';
import { signInSchema, signupSchema } from './src/validators/authValidator';
import { validateRequest } from './src/middleware/validateMiddleware';
import { loginUser, registerUser } from './src/presentation/userController';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
  "*",
  cors({
    origin: 'http://localhost:3001',
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    maxAge: 600,
  })
);


app.post('/register', validateRequest(signupSchema), registerUser);
app.post('/login', validateRequest(signInSchema), loginUser);

export default app;
