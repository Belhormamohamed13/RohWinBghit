/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Drop the check constraint that was created by the old enum
    await knex.raw('ALTER TABLE trips DROP CONSTRAINT IF EXISTS trips_status_check');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Re-add the constraint if needed, but we wanted to get rid of it
    // table.enum('status', ['active', 'completed', 'cancelled']).defaultTo('active');
};
