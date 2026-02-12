/**
 * Add verification fields to users table
 */
exports.up = function (knex) {
    return knex.schema.table('users', table => {
        table.string('identity_card_front_url');
        table.string('identity_card_back_url');
        table.string('license_front_url');
        table.string('license_back_url');
        table.string('verification_status').defaultTo('not_started'); // not_started, pending, verified, rejected
        table.text('verification_notes');
        table.timestamp('verified_at');
    });
};

exports.down = function (knex) {
    return knex.schema.table('users', table => {
        table.dropColumns([
            'identity_card_front_url',
            'identity_card_back_url',
            'license_front_url',
            'license_back_url',
            'verification_status',
            'verification_notes',
            'verified_at'
        ]);
    });
};
