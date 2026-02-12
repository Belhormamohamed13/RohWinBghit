/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('chats', function (table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('user1_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
            table.uuid('user2_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
            table.unique(['user1_id', 'user2_id']);
            table.timestamps(true, true);
        })
        .createTable('messages', function (table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('chat_id').references('id').inTable('chats').onDelete('CASCADE').notNullable();
            table.uuid('sender_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
            table.text('content').notNullable();
            table.string('type').defaultTo('text'); // text, image, location, system
            table.timestamp('read_at');
            table.timestamps(true, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('messages')
        .dropTableIfExists('chats');
};
