/**
 * Vehicle Model
 * Represents driver vehicles with encrypted license plates
 */

const encryptionService = require('../services/encryption.service');

class VehicleModel {
  constructor(knex) {
    this.knex = knex;
    this.tableName = 'vehicles';
  }

  /**
   * Create a new vehicle
   * @param {Object} vehicleData - Vehicle data
   * @returns {Promise<Object>} Created vehicle
   */
  async create(vehicleData) {
    // Encrypt license plate
    const encryptedPlate = encryptionService.encrypt(vehicleData.licensePlate);

    const [vehicle] = await this.knex(this.tableName)
      .insert({
        owner_id: vehicleData.driverId || vehicleData.ownerId,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        color: vehicleData.color,
        license_plate_encrypted: encryptedPlate.encrypted,
        license_plate_iv: encryptedPlate.iv,
        license_plate_auth_tag: encryptedPlate.authTag,
        vehicle_type: vehicleData.vehicleType || 'standard',
        seats: vehicleData.seats || 4,
        luggage_capacity: vehicleData.luggageCapacity || 2,
        has_ac: vehicleData.hasAc || false,
        has_wifi: vehicleData.hasWifi || false,
        allows_pets: vehicleData.allowsPets || false,
        allows_smoking: vehicleData.allowsSmoking || false,
        insurance_document_url: vehicleData.insuranceDocumentUrl,
        registration_document_url: vehicleData.registrationDocumentUrl,
        is_verified: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.format(vehicle);
  }

  /**
   * Find vehicle by ID
   * @param {string} id - Vehicle ID
   * @returns {Promise<Object|null>} Vehicle object
   */
  async findById(id) {
    const vehicle = await this.knex(this.tableName)
      .where({ id, is_active: true })
      .first();
    return vehicle ? this.format(vehicle) : null;
  }

  /**
   * Find vehicles by driver ID
   * @param {string} driverId - Driver ID
   * @returns {Promise<Array>} Vehicles list
   */
  async findByDriverId(driverId) {
    const vehicles = await this.knex(this.tableName)
      .where({ owner_id: driverId, is_active: true })
      .orderBy('created_at', 'desc');

    return vehicles.map(v => this.format(v));
  }

  /**
   * Get driver's primary vehicle
   * @param {string} driverId - Driver ID
   * @returns {Promise<Object|null>} Primary vehicle
   */
  async getPrimaryVehicle(driverId) {
    const vehicle = await this.knex(this.tableName)
      .where({
        owner_id: driverId,
        is_active: true,
        is_verified: true
      })
      .orderBy('created_at', 'asc')
      .first();

    return vehicle ? this.format(vehicle) : null;
  }

  /**
   * Update vehicle
   * @param {string} id - Vehicle ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated vehicle
   */
  async update(id, updateData) {
    const data = {
      updated_at: new Date()
    };

    // Handle license plate update with encryption
    if (updateData.licensePlate) {
      const encryptedPlate = encryptionService.encrypt(updateData.licensePlate);
      data.license_plate_encrypted = encryptedPlate.encrypted;
      data.license_plate_iv = encryptedPlate.iv;
      data.license_plate_auth_tag = encryptedPlate.authTag;
    }

    // Map other fields
    const fieldMapping = {
      make: 'make',
      model: 'model',
      year: 'year',
      color: 'color',
      vehicleType: 'vehicle_type',
      seats: 'seats',
      luggageCapacity: 'luggage_capacity',
      hasAc: 'has_ac',
      hasWifi: 'has_wifi',
      allowsPets: 'allows_pets',
      allowsSmoking: 'allows_smoking',
      insuranceDocumentUrl: 'insurance_document_url',
      registrationDocumentUrl: 'registration_document_url'
    };

    for (const [key, dbField] of Object.entries(fieldMapping)) {
      if (updateData[key] !== undefined) {
        data[dbField] = updateData[key];
      }
    }

    const [vehicle] = await this.knex(this.tableName)
      .where({ id })
      .update(data)
      .returning('*');

    return this.format(vehicle);
  }

  /**
   * Verify vehicle
   * @param {string} id - Vehicle ID
   * @returns {Promise<Object>} Updated vehicle
   */
  async verify(id) {
    const [vehicle] = await this.knex(this.tableName)
      .where({ id })
      .update({
        is_verified: true,
        verified_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.format(vehicle);
  }

  /**
   * Soft delete vehicle
   * @param {string} id - Vehicle ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.knex(this.tableName)
      .where({ id })
      .update({
        is_active: false,
        deleted_at: new Date(),
        updated_at: new Date()
      });
  }

  /**
   * Decrypt and get license plate
   * @param {Object} vehicle - Vehicle record
   * @returns {string} Decrypted license plate
   */
  decryptLicensePlate(vehicle) {
    if (!vehicle.license_plate_encrypted) return null;

    try {
      // If iv and authTag are missing, it's likely plain text or old format
      if (!vehicle.license_plate_iv || !vehicle.license_plate_auth_tag) {
        return vehicle.license_plate_encrypted;
      }

      return encryptionService.decrypt({
        encrypted: vehicle.license_plate_encrypted,
        iv: vehicle.license_plate_iv,
        authTag: vehicle.license_plate_auth_tag,
        salt: vehicle.license_plate_salt || '' // Handle potential missing salt
      });
    } catch (error) {
      console.warn('Decryption failed for vehicle ID:', vehicle.id, '- Returning raw value');
      return vehicle.license_plate_encrypted;
    }
  }

  /**
   * Format vehicle object
   * @param {Object} vehicle - Raw vehicle object
   * @returns {Object} Formatted vehicle
   */
  format(vehicle) {
    if (!vehicle) return null;

    return {
      id: vehicle.id,
      ownerId: vehicle.owner_id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      licensePlate: this.decryptLicensePlate(vehicle),
      licensePlateMasked: this.maskLicensePlate(this.decryptLicensePlate(vehicle)),
      vehicleType: vehicle.vehicle_type,
      seats: vehicle.seats,
      luggageCapacity: vehicle.luggage_capacity,
      features: {
        hasAc: vehicle.has_ac,
        hasWifi: vehicle.has_wifi,
        allowsPets: vehicle.allows_pets,
        allowsSmoking: vehicle.allows_smoking
      },
      documents: {
        insurance: vehicle.insurance_document_url,
        registration: vehicle.registration_document_url
      },
      isVerified: vehicle.is_verified,
      verifiedAt: vehicle.verified_at,
      isActive: vehicle.is_active,
      createdAt: vehicle.created_at,
      updatedAt: vehicle.updated_at
    };
  }

  /**
   * Mask license plate for display
   * @param {string} plate - License plate
   * @returns {string} Masked plate
   */
  maskLicensePlate(plate) {
    if (!plate) return null;
    if (plate.length <= 4) return plate;
    return plate.substring(0, 2) + '***' + plate.substring(plate.length - 2);
  }

  /**
   * Get vehicle statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    const stats = await this.knex(this.tableName)
      .where({ is_active: true })
      .select(
        this.knex.raw('COUNT(*) as total_vehicles'),
        this.knex.raw("COUNT(*) FILTER (WHERE is_verified = true) as verified_vehicles"),
        this.knex.raw("COUNT(*) FILTER (WHERE vehicle_type = 'economy') as economy"),
        this.knex.raw("COUNT(*) FILTER (WHERE vehicle_type = 'standard') as standard"),
        this.knex.raw("COUNT(*) FILTER (WHERE vehicle_type = 'comfort') as comfort"),
        this.knex.raw("COUNT(*) FILTER (WHERE vehicle_type = 'premium') as premium")
      )
      .first();

    return stats;
  }
}

module.exports = VehicleModel;
