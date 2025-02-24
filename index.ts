import { Hono } from 'hono';
import userRouter from './src/presentation/userController';
import { cors } from 'hono/cors';

const app = new Hono();

app.use("*", cors({
  origin: 'http://localhost:3000',
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  maxAge: 600,
}));

app.route('/', userRouter);

export default app;
