import { ForumsController } from "../controllers/forums.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

async function routes(fastify, options) {

    // Public routes
    fastify.get('/forums', ForumsController.getAllForums);
    fastify.get('/forums/:id', ForumsController.getForumById);

    // Protected routes (require authentication)
    fastify.post('/forums', { preHandler: [authMiddleware, requireRole('admin')] }, ForumsController.createForum);
    fastify.put('/forums/:id', { preHandler: [authMiddleware, requireRole('admin')] }, ForumsController.updateForum);
    fastify.delete('/forums/:id', { preHandler: [authMiddleware, requireRole('admin')] }, ForumsController.deleteForum);
    
    fastify.get('/forums/:id/posts', ForumsController.getPostsByForumId);
}

export default routes;