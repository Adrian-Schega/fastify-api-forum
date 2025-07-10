export class CategoriesController {

    static async getAllCategories(request, reply) {
        // Logic to fetch all categories
        try {
            const categories = await request.db('categories').select('*');
            return reply.status(200).send({ success: true, message: "Pomyślnie pobrano kategorie", data: categories });
        } catch (error) {
            console.error('Error fetching categories:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas pobierania kategorii", data: null });
        }
    }

    static async getCategoryById(request, reply) {
        // Logic to fetch a category by ID
        const { id } = request.params;
        try {
            const category = await request.db('categories').where({ id }).first();
            if (!category) {
                return reply.status(404).send({ success: false, message: "Kategoria nie znaleziona", data: null });
            }
            return reply.status(200).send({ success: true, message: "Pomyślnie pobrano kategorię", data: category });
        } catch (error) {
            console.error('Error fetching category:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas pobierania kategorii", data: null });
        }
    }

    static async createCategory(request, reply) {
        // Logic to create a new category
        const { name, description, slug } = request.body;
        try {
            const newCategory = {
                name,
                description,
                slug,
                created_by: request.user.id // Assuming user ID is available in request
            };
            const [category] = await request.db('categories').insert(newCategory).returning('*');
            return reply.status(201).send({ success: true, message: "Pomyślnie utworzono kategorię", data: category });
        } catch (error) {
            console.error('Error creating category:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas tworzenia kategorii", data: null });
        }
    }

    static async updateCategory(request, reply) {
        // Logic to update an existing category
        const { id } = request.params;
        const { name, description, slug } = request.body;
        try {
            const updatedCategory = {
                name,
                description,
                slug
            };
            const [category] = await request.db('categories').where({ id }).update(updatedCategory).returning('*');
            if (!category) {
                return reply.status(404).send({ success: false, message: "Kategoria nie znaleziona", data: null });
            }
            return reply.status(200).send({ success: true, message: "Pomyślnie zaktualizowano kategorię", data: category });
        } catch (error) {
            console.error('Error updating category:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas aktualizacji kategorii", data: null });
        }
    }       
    static async deleteCategory(request, reply) {
        // Logic to delete a category
        const { id } = request.params;
        try {
            const deletedCount = await request.db('categories').where({ id }).del();
            if (deletedCount === 0) {
                return reply.status(404).send({ success: false, message: "Kategoria nie znaleziona", data: null });
            }
            return reply.status(200).send({ success: true, message: "Pomyślnie usunięto kategorię", data: null });
        } catch (error) {
            console.error('Error deleting category:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas usuwania kategorii", data: null });
        }
    }

    static async getForumsByCategoryId(request, reply) {
        // Logic to fetch forums by category ID
        const { id } = request.params;
        try {
            const forums = await request.db('forums').where({ category_id: id }).select('*');
            return reply.status(200).send({ success: true, message: "Pomyślnie pobrano fora dla kategorii", data: forums });
        } catch (error) {
            console.error('Error fetching forums by category ID:', error);
            return reply.status(500).send({ success: false, message: "Błąd podczas pobierania forów dla kategorii", data: null });
        }
    }
}
