import { FastifyInstance } from 'fastify';
import { authenticate } from './controlers/authenticate';
import { profile } from './controlers/profile';
import { register } from './controlers/register';
import { verifyJWT } from './middlewares/verify-jwt';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);

  app.post('/sessions', authenticate);

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile);
}