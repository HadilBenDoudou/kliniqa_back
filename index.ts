import { Hono } from 'hono';
import userRouter from './src/presentation/userController';
import { cors } from 'hono/cors';
import categoryController from './src/presentation/products/CategorieController';
import productRouter from './src/presentation/products/ProduitController';
import detailController from './src/presentation/products/detailsController';

const app = new Hono();

app.use("*", cors({
  origin: 'http://localhost:3000',
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  maxAge: 600,
}));

app.route('/', userRouter);

app.route('/', categoryController);
app.route('/', productRouter);
app.route('/', detailController);

export default app;
