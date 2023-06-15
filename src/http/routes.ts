import { FastifyInstance } from 'fastify';
import { register } from './controlers/register';

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register);
}