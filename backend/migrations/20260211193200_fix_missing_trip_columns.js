/**
 * Fix missing columns in trips table
 * Adds columns expected by TripModel but missing in migrations
 */
exports.up = function (knex) {
    return knex.schema.table('trips', table => {
        table.text('from_address');
        table.decimal('from_latitude', 10, 8);
        table.decimal('from_longitude', 11, 8);
        table.text('to_address');
        table.decimal('to_latitude', 10, 8);
        table.decimal('to_longitude', 11, 8);
        table.timestamp('estimated_arrival');
        table.string('pricing_strategy').defaultTo('standard');
        table.string('max_luggage_size').defaultTo('medium');
    });
};

exports.down = function (knex) {
    return knex.schema.table('trips', table => {
        table.dropColumns([
            'from_address', 'from_latitude', 'from_longitude',
            'to_address', 'to_latitude', 'to_longitude',
            'estimated_arrival', 'pricing_strategy', 'max_luggage_size'
        ]);
    });
};
