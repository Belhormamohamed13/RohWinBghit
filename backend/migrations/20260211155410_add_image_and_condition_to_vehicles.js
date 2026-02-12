/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('vehicles', table => {
        table.string('image_url');
        table.enum('condition', ['new', 'excellent', 'good', 'fair']).defaultTo('good');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('vehicles', table => {
        table.dropColumn('image_url');
        table.dropColumn('condition');
    });
};
