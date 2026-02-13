/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Add status to users table if it doesn't exist
    const hasUserStatus = await knex.schema.hasColumn('users', 'status');
    if (!hasUserStatus) {
        await knex.schema.table('users', table => {
            table.string('status', 20).defaultTo('active');
        });
    }

    // 2. Modify trips status column to be a flexible string
    // This allows us to use all the new statuses requested: 
    // PENDING, APPROVED, ACTIVE, IN_PROGRESS, FINISHED, CANCELLED, SUSPENDED, FULL
    await knex.schema.alterTable('trips', table => {
        table.string('status', 20).defaultTo('pending').alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    const hasUserStatus = await knex.schema.hasColumn('users', 'status');
    if (hasUserStatus) {
        await knex.schema.table('users', table => {
            table.dropColumn('status');
        });
    }

    // We keep it as string in down as well to avoid enum errors
    await knex.schema.alterTable('trips', table => {
        table.string('status', 20).defaultTo('active').alter();
    });
};
