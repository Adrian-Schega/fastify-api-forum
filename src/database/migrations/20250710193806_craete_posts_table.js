/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('posts', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('content').notNullable();
       
        table.integer('forum_id').unsigned().notNullable();
        table.foreign('forum_id').references('id').inTable('forums');
       
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
    return knex.schema.dropTableIfExists('posts');
};
