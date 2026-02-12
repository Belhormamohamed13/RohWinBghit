/**
 * Add Reviews Table
 */
exports.up = function (knex) {
    return knex.schema.createTable('reviews', table => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('booking_id').references('id').inTable('bookings').onDelete('SET NULL');
        table.uuid('trip_id').references('id').inTable('trips').onDelete('SET NULL');
        table.uuid('reviewer_id').references('id').inTable('users').onDelete('CASCADE');
        table.uuid('reviewee_id').references('id').inTable('users').onDelete('CASCADE');
        table.enum('review_type', ['passenger_to_driver', 'driver_to_passenger']).notNullable();
        table.integer('rating').notNullable();
        table.integer('punctuality_rating');
        table.integer('cleanliness_rating');
        table.integer('communication_rating');
        table.integer('driving_rating');
        table.text('comment');
        table.boolean('is_anonymous').defaultTo(false);
        table.boolean('is_flagged').defaultTo(false);
        table.text('flag_reason');
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('reviews');
};
