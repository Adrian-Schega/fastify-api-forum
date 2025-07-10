/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('forums', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('slug').notNullable().unique();

        table.integer('category_id').unsigned().notNullable();
        table.foreign('category_id').references('id').inTable('categories');

        table.integer('parent_id').unsigned().nullable();
        table.foreign('parent_id').references('id').inTable('forums');

        table.integer('created_by').unsigned().notNullable();
        table.foreign('created_by').references('id').inTable('users');
        
        table.timestamps(true, true);
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('forums');
};
