/**
 * Update Trips and Vehicles Schema to match Models
 * Fixed: Awaiting hasColumn checks
 */
exports.up = async function (knex) {
    // Update trips table
    const hasTotalSeats = await knex.schema.hasColumn('trips', 'total_seats');
    const hasTotalPrice = await knex.schema.hasColumn('trips', 'total_price');
    const hasDepartureDate = await knex.schema.hasColumn('trips', 'departure_date');
    const hasDistanceKm = await knex.schema.hasColumn('trips', 'distance_km');
    const hasDurationMinutes = await knex.schema.hasColumn('trips', 'duration_minutes');
    const hasStartedAt = await knex.schema.hasColumn('trips', 'started_at');
    const hasCompletedAt = await knex.schema.hasColumn('trips', 'completed_at');
    const hasCancelledAt = await knex.schema.hasColumn('trips', 'cancelled_at');
    const hasCancellationReason = await knex.schema.hasColumn('trips', 'cancellation_reason');

    await knex.schema.table('trips', table => {
        if (!hasTotalSeats) table.integer('total_seats');
        if (!hasTotalPrice) table.decimal('total_price', 10, 2);
        if (!hasDepartureDate) table.date('departure_date');
        if (!hasDistanceKm) table.decimal('distance_km', 10, 2);
        if (!hasDurationMinutes) table.integer('duration_minutes');
        if (!hasStartedAt) table.timestamp('started_at');
        if (!hasCompletedAt) table.timestamp('completed_at');
        if (!hasCancelledAt) table.timestamp('cancelled_at');
        if (!hasCancellationReason) table.text('cancellation_reason');
    });

    // Update vehicles table
    const hasDriverId = await knex.schema.hasColumn('vehicles', 'driver_id'); // Re-checking driver_id vs owner_id (Initial schema has owner_id)
    const hasLicensePlateIv = await knex.schema.hasColumn('vehicles', 'license_plate_iv');
    const hasLicensePlateAuthTag = await knex.schema.hasColumn('vehicles', 'license_plate_auth_tag');
    const hasVehicleType = await knex.schema.hasColumn('vehicles', 'vehicle_type');
    const hasSeatsColumn = await knex.schema.hasColumn('vehicles', 'seats');
    const hasLuggageCapacity = await knex.schema.hasColumn('vehicles', 'luggage_capacity');
    const hasAc = await knex.schema.hasColumn('vehicles', 'has_ac');
    const hasWifi = await knex.schema.hasColumn('vehicles', 'has_wifi');
    const hasAllowsPets = await knex.schema.hasColumn('vehicles', 'allows_pets');
    const hasAllowsSmoking = await knex.schema.hasColumn('vehicles', 'allows_smoking');
    const hasInsuranceDoc = await knex.schema.hasColumn('vehicles', 'insurance_document_url');
    const hasRegistrationDoc = await knex.schema.hasColumn('vehicles', 'registration_document_url');
    const hasVerifiedAt = await knex.schema.hasColumn('vehicles', 'verified_at');
    const hasIsActive = await knex.schema.hasColumn('vehicles', 'is_active');
    const hasLicensePlateSalt = await knex.schema.hasColumn('vehicles', 'license_plate_salt');

    await knex.schema.table('vehicles', table => {
        // Initial schema already has owner_id, so we skip driver_id which was a mistake in my thought process earlier
        // but models might expect driver_id if not updated. I updated models to use owner_id.
        if (!hasLicensePlateIv) table.string('license_plate_iv');
        if (!hasLicensePlateAuthTag) table.string('license_plate_auth_tag');
        if (!hasLicensePlateSalt) table.string('license_plate_salt');
        if (!hasVehicleType) table.string('vehicle_type').defaultTo('standard');
        if (!hasSeatsColumn) table.integer('seats').defaultTo(4);
        if (!hasLuggageCapacity) table.integer('luggage_capacity').defaultTo(2);
        if (!hasAc) table.boolean('has_ac').defaultTo(false);
        if (!hasWifi) table.boolean('has_wifi').defaultTo(false);
        if (!hasAllowsPets) table.boolean('allows_pets').defaultTo(false);
        if (!hasAllowsSmoking) table.boolean('allows_smoking').defaultTo(false);
        if (!hasInsuranceDoc) table.string('insurance_document_url');
        if (!hasRegistrationDoc) table.string('registration_document_url');
        if (!hasVerifiedAt) table.timestamp('verified_at');
        if (!hasIsActive) table.boolean('is_active').defaultTo(true);
    });
};

exports.down = function (knex) {
    return knex.schema
        .table('trips', table => {
            table.dropColumns([
                'total_seats', 'total_price', 'departure_date', 'distance_km',
                'duration_minutes', 'started_at', 'completed_at',
                'cancelled_at', 'cancellation_reason'
            ]).catch(() => { });
        })
        .table('vehicles', table => {
            table.dropColumns([
                'license_plate_iv', 'license_plate_auth_tag',
                'vehicle_type', 'seats', 'luggage_capacity', 'has_ac',
                'has_wifi', 'allows_pets', 'allows_smoking',
                'insurance_document_url', 'registration_document_url', 'verified_at'
            ]).catch(() => { });
        });
};
