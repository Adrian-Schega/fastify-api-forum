import fp from 'fastify-plugin';
import jwtPlugin from '@fastify/jwt';
import cookiePlugin from '@fastify/cookie';

async function jwt(fastify, options) {
  // Rejestrujemy cookie plugin
  await fastify.register(cookiePlugin);

  // Rejestrujemy JWT plugin
  await fastify.register(jwtPlugin, {
    secret: process.env.JWT_TOKEN_SECRET || 'supersekretnyklucz',
  });

  // Metoda do generowania tokena JWT
  fastify.decorate('createToken', function (payload) {
    return fastify.jwt.sign(payload, { expiresIn: '7d' });
  });

  // Metoda do ustawiania tokena w cookie
  fastify.decorate('setAuthCookie', function (reply, payload) {
    const token = fastify.createToken(payload);
    reply.setCookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 3600,
      secure: process.env.NODE_ENV === 'production'
    });
  });

  // Dekorujemy request metodą do weryfikacji tokena z cookie
  fastify.decorateRequest('verifyAuth', async function () {
      try {
        const token = this.cookies.auth_token;
        if (!token) return null;
        const payload = await fastify.jwt.verify(token);
        return payload;
      } catch {
        return null;
      }
  });

  // Metoda do usuwania tokena z cookie
  fastify.decorate('clearAuthCookie', function (reply) {
    reply.clearCookie('auth_token', {
      path: '/',
      sameSite: 'lax'
    });
  });
}

export default fp(jwt);
