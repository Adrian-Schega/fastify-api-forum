import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

async function routes (fastify, options) {
  
    // Publiczne trasy (bez autoryzacji)
    fastify.post('/register', AuthController.register);
    fastify.post('/login', AuthController.login);
    
    // Chronione trasy (wymagają autoryzacji)
    fastify.post('/logout', { preHandler: authMiddleware }, AuthController.logout);
    fastify.post('/me', { preHandler: authMiddleware }, AuthController.getMe);

}

  
export default routes;