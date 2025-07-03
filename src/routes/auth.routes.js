import { AuthController } from "../controllers/auth.controller.js";

async function routes (fastify, options) {
  
    fastify.post('/register', AuthController.register);
    fastify.post('/login', AuthController.login);
    fastify.post('/logout', AuthController.logout);
    fastify.post('/me', AuthController.getMe);

}

  
export default routes;