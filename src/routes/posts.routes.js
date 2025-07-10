import { requireRole } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { PostsController } from "../controllers/posts.controller.js";

async function routes(fastify, options) {
    // Public routes
    fastify.get('/posts', PostsController.getAllPosts);
    fastify.get('/posts/:id', PostsController.getPostById);

    // Protected routes (require authentication)
    fastify.post('/posts', { preHandler: [authMiddleware, requireRole('user')] }, PostsController.createPost);
    fastify.put('/posts/:id', { preHandler: [authMiddleware, requireRole('user')] }, PostsController.updatePost);
    fastify.delete('/posts/:id', { preHandler: [authMiddleware, requireRole('admin')] }, PostsController.deletePost);
}