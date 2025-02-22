import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { signInSchema, signupSchema } from './src/validators/authValidator';
import { validateRequest } from './src/middleware/validateMiddleware';
import { loginUser, registerUser } from './src/presentation/userController';

const app = new Hono();

// Config CORS global
app.use(
  '*',
  cors({
    origin: 'http://localhost:3001', // Autorise les requêtes depuis le client
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Routes avec CORS appliqué aussi directement pour éviter les erreurs
app.post('/register', cors(), validateRequest(signupSchema), registerUser);
app.post('/login', cors(), validateRequest(signInSchema), loginUser);

export default app;