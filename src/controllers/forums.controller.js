export class ForumsController {
    static async getAllForums(request, reply) {
        // Logic to fetch all forums
        try {
            const forums = await request.db('forums').select('*');
            return reply.status(200).send({ succuess: true, message: "Pomyślnie pobrano fora", data: forums });
        } catch (error) {
            console.error('Error fetching forums:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas pobierania forów", data: null });
        } 
    }

    static async getForumById(request, reply) {
        // Logic to fetch a forum by ID
        const { id } = request.params;
        try {
            const forum = await request.db('forums').where({ id }).first();
            if (!forum) {
                return reply.status(404).send({ success: false, message: "Forum nie znaleziono", data: null });
            }
            return reply.status(200).send({ success: true, message: "Pomyślnie pobrano forum", data: forum });
        } catch (error) {
            console.error('Error fetching forum:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas pobierania forum", data: null });
        }
    }

    static async createForum(request, reply) {
        // Logic to create a new forum
        const { name, description, slug, category_id, parent_id } = request.body;
        try {
            const newForum = {
                name,
                description,
                slug,
                category_id,
                parent_id: parent_id || null,
                created_by: request.user.id // Assuming user ID is available in request
            };
            const [forum] = await request.db('forums').insert(newForum).returning('*');
            return reply.status(201).send({ success: true, message: "Pomyślnie utworzono forum", data: forum });
        } catch (error) {
            console.error('Error creating forum:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas tworzenia forum", data: null });
        }
    }      

    static async updateForum(request, reply) {
        // Logic to update an existing forum
        const { id } = request.params;
        const { name, description, slug, category_id, parent_id } = request.body;
        try {
            const updatedForum = {
                name,
                description,
                category_id,
                slug,
                parent_id: parent_id || null
            };
            const [forum] = await request.db('forums').where({ id }).update(updatedForum).returning('*');
            if (!forum) {
                return reply.status(404).send({ success: false, message: "Forum nie znaleziono", data: null });
            }
            return reply.status(200).send({ success: true, message: "Pomyślnie zaktualizowano forum", data: forum });
        } catch (error) {
            console.error('Error updating forum:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas aktualizacji forum", data: null });
        }
    }

    static async deleteForum(request, reply) {
        // Logic to delete a forum
        const { id } = request.params;
        try {
            const deletedCount = await request.db('forums').where({ id }).del();
            if (deletedCount === 0) {
                return reply.status(404).send({ success: false, message: "Forum nie znaleziono", data: null });
            }
            return reply.status(200).send({ success: true, message: "Pomyślnie usunięto forum", data: null });
        } catch (error) {
            console.error('Error deleting forum:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas usuwania forum", data: null }); 
        }
    }

    static async getPostsByForumId(request, reply) {
        // Logic to fetch posts by forum ID
        const { id } = request.params;
        try {
            const posts = await request.db('posts').where({ forum_id: id }).select('*');
            return reply.status(200).send({ success: true, message: "Pomyślnie pobrano posty", data: posts });
        } catch (error) {
            console.error('Error fetching posts:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas pobierania postów", data: null });
        }
    }
}