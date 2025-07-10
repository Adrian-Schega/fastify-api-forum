import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { CategoriesController } from '../controllers/categories.controller.js';

async function routes(fastify, options) {
    // Public routes
    fastify.get('/categories', CategoriesController.getAllCategories);
    fastify.get('/categories/:id', CategoriesController.getCategoryById);

    // Protected routes (require authentication)
    fastify.post('/categories', { preHandler: [authMiddleware, requireRole('admin')] }, CategoriesController.createCategory);
    fastify.put('/categories/:id', { preHandler: [authMiddleware, requireRole('admin')] }, CategoriesController.updateCategory);
    fastify.delete('/categories/:id', { preHandler: [authMiddleware, requireRole('admin')] }, CategoriesController.deleteCategory);

    fastify.get('/categories/:id/forums', CategoriesController.getForumsByCategoryId);
}

export default routes;