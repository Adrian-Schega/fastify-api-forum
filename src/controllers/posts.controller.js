export class PostsController {
    static async getAllPosts(request, reply) {
        // Logic to fetch all posts
        try {
            const posts = await request.db('posts').select('*');
            return reply.send({ success: true, message: "Pomyślnie pobrano posty", data: posts });
        } catch (error) {
            return reply.status(500).send({ success: false, message: "Błąd podczas pobierania postów", data: null });
        }
    }

    static async getPostById(request, reply) {
        // Logic to fetch a post by ID
        const { id } = request.params;
        try {
            const post = await request.db('posts').where({ id }).first();
            if (!post) {
                return reply.status(404).send({ success: false, message: "Post nie znaleziono", data: null });
            }
            return reply.send(post);
        } catch (error) {
            return reply.status(500).send({ success: false, message: "Błąd podczas pobierania posta", data: null });
        }
    }

    static async createPost(request, reply) {
        // Logic to create a new post
        const { title, content } = request.body;
        try {
            const [newPost] = await request.db('posts').insert({
                title,
                content,
                created_by: request.user.id
            }).returning('*');
            return reply.status(201).send({ success: true, message: "Pomyślnie utworzono post", data: newPost   });
        } catch (error) {
            return reply.status(500).send({ success: false, message: "Błąd podczas tworzenia posta", data: null });
        }
    }

    static async updatePost(request, reply) {
        // Logic to update a post
        const { id } = request.params;
        const { title, content } = request.body;
        try {
            const owner = await request.db('posts').where({ id }).select('created_by').first();
            if ((owner !== request.user.id) || request.user.role !== 'admin') {
                return reply.status(403).send({ success: false, message: "Nie jesteś autorem posta", data: null });
            }
            const [updatedPost] = await request.db('posts').where({ id }).update({
                title,
                content
            }).returning('*');
            if (!updatedPost) {
                return reply.status(404).send({ success: false, message: "Nie znaleziono posta", data: null });
            }
            return reply.send(updatedPost);
        } catch (error) {
            return reply.status(500).send({ success: false, message: "Błąd podczas aktualizacji posta", data: null });
        }
    }

    static async deletePost(request, reply) {
        // Logic to delete a post
        const { id } = request.params;
        try {
            const owner = await request.db('posts').where({ id }).select('created_by').first();
            if (owner !== request.user.id || request.user.role !== 'admin') {
                return reply.status(404).send({ success: false, message: "Nie jesteś autorem posta", data: null });
            }
            const deletedCount = await request.db('posts').where({ id }).del();
            if (deletedCount === 0) {
                return reply.status(404).send({ success: false, message: "Nie znaleziono posta", data: null });
            }
            return reply.status(204).send();
        } catch (error) {
            return reply.status(500).send({ success: false, message: "Błąd podczas usuwania posta", data: null });
        }
    }
}