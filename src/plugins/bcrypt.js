import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';

async function bcryptPlugin(fastify, options) {
  // Rejestrujemy bcrypt jako dekorator, żeby był dostępny globalnie
  fastify.decorate('bcrypt', bcrypt);
}

export default fp(bcryptPlugin);
