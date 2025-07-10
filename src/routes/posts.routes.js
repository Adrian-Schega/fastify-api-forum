import { requireRole } from "../middlewares/role.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { PostsController } from "../controllers/posts.controller.js";

async function routes(fastify, options) {
    // Public routes
    fastify.get('/posts', PostsController.getAllPosts);
    fastify.get('/posts/:id', PostsController.getPostById);

    // Protected routes (require authentication)
    fastify.post('/posts', { preHandler: authMiddleware }, PostsController.createPost);
    fastify.put('/posts/:id', { preHandler: authMiddleware }, PostsController.updatePost);
    fastify.delete('/posts/:id', { preHandler: authMiddleware }, PostsController.deletePost);
}

export default routes;