/**
 * Initial Schema Migration
 */
exports.up = function (knex) {
    return knex.schema
        // Users table
        .createTable('users', table => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            table.string('phone');
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.date('date_of_birth');
            table.enum('gender', ['male', 'female', 'other']);
            table.string('avatar_url');
            table.enum('role', ['passenger', 'driver', 'admin']).defaultTo('passenger');
            table.boolean('is_verified').defaultTo(false);
            table.boolean('is_active').defaultTo(true);
            table.timestamp('email_verified_at');
            table.timestamp('last_login_at');
            table.string('fcm_token');
            table.timestamps(true, true);
            table.timestamp('deleted_at');
        })
        // Wilayas table (Algerian Provinces)
        .createTable('wilayas', table => {
            table.integer('code').primary(); // 1 to 58
            table.string('name').notNullable(); // Common name
            table.string('name_ar').notNullable();
            table.string('name_fr').notNullable();
            table.decimal('latitude', 10, 8);
            table.decimal('longitude', 11, 8);
            table.timestamps(true, true);
        })
        // Vehicles table
        .createTable('vehicles', table => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE');
            table.string('make').notNullable();
            table.string('model').notNullable();
            table.integer('year');
            table.string('color');
            table.string('license_plate_encrypted').notNullable();
            table.boolean('is_verified').defaultTo(false);
            table.timestamps(true, true);
        })
        // Trips table
        .createTable('trips', table => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('driver_id').references('id').inTable('users').onDelete('CASCADE');
            table.integer('from_wilaya_id').references('code').inTable('wilayas');
            table.string('from_city').notNullable();
            table.integer('to_wilaya_id').references('code').inTable('wilayas');
            table.string('to_city').notNullable();
            table.timestamp('departure_time').notNullable();
            table.integer('available_seats').notNullable();
            table.decimal('price_per_seat', 10, 2).notNullable();
            table.uuid('vehicle_id').references('id').inTable('vehicles');
            table.boolean('luggage_allowed').defaultTo(true);
            table.boolean('smoking_allowed').defaultTo(false);
            table.boolean('pets_allowed').defaultTo(false);
            table.boolean('instant_booking').defaultTo(false);
            table.text('description');
            table.enum('status', ['active', 'completed', 'cancelled']).defaultTo('active');
            table.text('cancel_reason');
            table.timestamps(true, true);
        })
        // Bookings table
        .createTable('bookings', table => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('trip_id').references('id').inTable('trips').onDelete('CASCADE');
            table.uuid('passenger_id').references('id').inTable('users').onDelete('CASCADE');
            table.integer('num_seats').notNullable().defaultTo(1);
            table.decimal('total_price', 10, 2).notNullable();
            table.enum('status', ['pending', 'confirmed', 'cancelled', 'completed']).defaultTo('pending');
            table.enum('payment_status', ['unpaid', 'paid', 'refunded']).defaultTo('unpaid');
            table.string('payment_method');
            table.text('cancel_reason');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('bookings')
        .dropTableIfExists('trips')
        .dropTableIfExists('vehicles')
        .dropTableIfExists('wilayas')
        .dropTableIfExists('users');
};
