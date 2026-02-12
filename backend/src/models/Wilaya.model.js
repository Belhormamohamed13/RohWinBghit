/**
 * Wilaya Model
 * Represents Algerian provinces (wilayas) with coordinates
 */

class WilayaModel {
  constructor(knex) {
    this.knex = knex;
    this.tableName = 'wilayas';
    this.wilayasData = this.getWilayasData();
  }

  /**
   * Get all 58 Algerian wilayas with their data
   * @returns {Array} Wilayas data
   */
  getWilayasData() {
    return [
      { code: 1, name: 'Adrar', nameAr: 'أدرار', latitude: 27.9767, longitude: -0.2030 },
      { code: 2, name: 'Chlef', nameAr: 'الشلف', latitude: 36.1653, longitude: 1.3345 },
      { code: 3, name: 'Laghouat', nameAr: 'الأغواط', latitude: 33.8056, longitude: 2.8714 },
      { code: 4, name: 'Oum El Bouaghi', nameAr: 'أم البواقي', latitude: 35.8750, longitude: 7.1136 },
      { code: 5, name: 'Batna', nameAr: 'باتنة', latitude: 35.5559, longitude: 6.1744 },
      { code: 6, name: 'Béjaïa', nameAr: 'بجاية', latitude: 36.7519, longitude: 5.0557 },
      { code: 7, name: 'Biskra', nameAr: 'بسكرة', latitude: 34.8500, longitude: 5.7333 },
      { code: 8, name: 'Béchar', nameAr: 'بشار', latitude: 31.6167, longitude: -2.2167 },
      { code: 9, name: 'Blida', nameAr: 'البليدة', latitude: 36.4700, longitude: 2.8300 },
      { code: 10, name: 'Bouira', nameAr: 'البويرة', latitude: 36.3800, longitude: 3.9000 },
      { code: 11, name: 'Tamanrasset', nameAr: 'تمنراست', latitude: 22.7850, longitude: 5.5228 },
      { code: 12, name: 'Tébessa', nameAr: 'تبسة', latitude: 35.4042, longitude: 8.1242 },
      { code: 13, name: 'Tlemcen', nameAr: 'تلمسان', latitude: 34.8783, longitude: -1.3150 },
      { code: 14, name: 'Tiaret', nameAr: 'تيارت', latitude: 35.3711, longitude: 1.3160 },
      { code: 15, name: 'Tizi Ouzou', nameAr: 'تيزي وزو', latitude: 36.7167, longitude: 4.0500 },
      { code: 16, name: 'Alger', nameAr: 'الجزائر', latitude: 36.7538, longitude: 3.0588 },
      { code: 17, name: 'Djelfa', nameAr: 'الجلفة', latitude: 34.6667, longitude: 3.2500 },
      { code: 18, name: 'Jijel', nameAr: 'جيجل', latitude: 36.8206, longitude: 5.7667 },
      { code: 19, name: 'Sétif', nameAr: 'سطيف', latitude: 36.1911, longitude: 5.4136 },
      { code: 20, name: 'Saïda', nameAr: 'سعيدة', latitude: 34.8303, longitude: 0.1517 },
      { code: 21, name: 'Skikda', nameAr: 'سكيكدة', latitude: 36.8667, longitude: 6.9000 },
      { code: 22, name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', latitude: 35.1939, longitude: -0.6414 },
      { code: 23, name: 'Annaba', nameAr: 'عنابة', latitude: 36.9000, longitude: 7.7667 },
      { code: 24, name: 'Guelma', nameAr: 'قالمة', latitude: 36.4667, longitude: 7.4333 },
      { code: 25, name: 'Constantine', nameAr: 'قسنطينة', latitude: 36.3650, longitude: 6.6147 },
      { code: 26, name: 'Médéa', nameAr: 'المدية', latitude: 36.2667, longitude: 2.7500 },
      { code: 27, name: 'Mostaganem', nameAr: 'مستغانم', latitude: 35.9333, longitude: 0.0900 },
      { code: 28, name: 'M\'Sila', nameAr: 'المسيلة', latitude: 35.7058, longitude: 4.5419 },
      { code: 29, name: 'Mascara', nameAr: 'معسكر', latitude: 35.4000, longitude: 0.1333 },
      { code: 30, name: 'Ouargla', nameAr: 'ورقلة', latitude: 31.9500, longitude: 5.3167 },
      { code: 31, name: 'Oran', nameAr: 'وهران', latitude: 35.6969, longitude: -0.6331 },
      { code: 32, name: 'El Bayadh', nameAr: 'البيض', latitude: 33.6833, longitude: 1.0167 },
      { code: 33, name: 'Illizi', nameAr: 'إليزي', latitude: 26.4833, longitude: 8.4667 },
      { code: 34, name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج', latitude: 36.0731, longitude: 4.7608 },
      { code: 35, name: 'Boumerdès', nameAr: 'بومرداس', latitude: 36.7594, longitude: 3.4742 },
      { code: 36, name: 'El Tarf', nameAr: 'الطارف', latitude: 36.7672, longitude: 8.3138 },
      { code: 37, name: 'Tindouf', nameAr: 'تندوف', latitude: 27.6711, longitude: -8.1474 },
      { code: 38, name: 'Tissemsilt', nameAr: 'تيسمسيلت', latitude: 35.6072, longitude: 1.8108 },
      { code: 39, name: 'El Oued', nameAr: 'الوادي', latitude: 33.3683, longitude: 6.8675 },
      { code: 40, name: 'Khenchela', nameAr: 'خنشلة', latitude: 35.4167, longitude: 7.1333 },
      { code: 41, name: 'Souk Ahras', nameAr: 'سوق أهراس', latitude: 36.2864, longitude: 7.9511 },
      { code: 42, name: 'Tipaza', nameAr: 'تيبازة', latitude: 36.5897, longitude: 2.4475 },
      { code: 43, name: 'Mila', nameAr: 'ميلة', latitude: 36.4500, longitude: 6.2667 },
      { code: 44, name: 'Aïn Defla', nameAr: 'عين الدفلى', latitude: 36.2500, longitude: 1.9667 },
      { code: 45, name: 'Naâma', nameAr: 'النعامة', latitude: 33.2667, longitude: -0.3167 },
      { code: 46, name: 'Aïn Témouchent', nameAr: 'عين تموشنت', latitude: 35.3000, longitude: -1.1333 },
      { code: 47, name: 'Ghardaïa', nameAr: 'غرداية', latitude: 32.4833, longitude: 3.6667 },
      { code: 48, name: 'Relizane', nameAr: 'غليزان', latitude: 35.7333, longitude: 0.5500 },
      { code: 49, name: 'El M\'ghair', nameAr: 'المغير', latitude: 33.9500, longitude: 5.9167 },
      { code: 50, name: 'El Menia', nameAr: 'المنيعة', latitude: 30.5833, longitude: 2.8833 },
      { code: 51, name: 'Ouled Djellal', nameAr: 'أولاد جلال', latitude: 34.4333, longitude: 5.0667 },
      { code: 52, name: 'Bordj Baji Mokhtar', nameAr: 'برج باجي مختار', latitude: 21.3333, longitude: 0.9500 },
      { code: 53, name: 'Béni Abbès', nameAr: 'بني عباس', latitude: 30.1333, longitude: -2.1667 },
      { code: 54, name: 'Timimoun', nameAr: 'تيميمون', latitude: 29.2583, longitude: 0.2306 },
      { code: 55, name: 'Touggourt', nameAr: 'تقرت', latitude: 33.1000, longitude: 6.0667 },
      { code: 56, name: 'Djanet', nameAr: 'جانت', latitude: 24.5542, longitude: 9.4847 },
      { code: 57, name: 'In Salah', nameAr: 'عين صالح', latitude: 27.1972, longitude: 2.4833 },
      { code: 58, name: 'In Guezzam', nameAr: 'عين قزام', latitude: 19.5667, longitude: 5.7667 }
    ];
  }

  /**
   * Seed wilayas data into database
   * @returns {Promise<void>}
   */
  async seed() {
    const exists = await this.knex(this.tableName).first();
    if (exists) return;

    const wilayas = this.wilayasData.map(w => ({
      code: w.code,
      name: w.name,
      name_ar: w.nameAr,
      latitude: w.latitude,
      longitude: w.longitude,
      is_active: true,
      created_at: new Date()
    }));

    await this.knex(this.tableName).insert(wilayas);
  }

  /**
   * Get all wilayas
   * @returns {Promise<Array>} Wilayas list
   */
  async findAll() {
    const wilayas = await this.knex(this.tableName)
      .where({ is_active: true })
      .orderBy('code', 'asc');

    return wilayas.map(w => this.format(w));
  }

  /**
   * Find wilaya by code
   * @param {number} code - Wilaya code
   * @returns {Promise<Object|null>} Wilaya object
   */
  async findByCode(code) {
    const wilaya = await this.knex(this.tableName)
      .where({ code, is_active: true })
      .first();
    return wilaya ? this.format(wilaya) : null;
  }

  /**
   * Find wilaya by name
   * @param {string} name - Wilaya name
   * @returns {Promise<Object|null>} Wilaya object
   */
  async findByName(name) {
    const wilaya = await this.knex(this.tableName)
      .where(function() {
        this.where('name', 'ilike', `%${name}%`)
          .orWhere('name_ar', 'ilike', `%${name}%`);
      })
      .where({ is_active: true })
      .first();
    return wilaya ? this.format(wilaya) : null;
  }

  /**
   * Search wilayas
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  async search(query) {
    const wilayas = await this.knex(this.tableName)
      .where(function() {
        this.where('name', 'ilike', `%${query}%`)
          .orWhere('name_ar', 'ilike', `%${query}%`)
          .orWhere('code::text', 'like', `%${query}%`);
      })
      .where({ is_active: true })
      .orderBy('code', 'asc');

    return wilayas.map(w => this.format(w));
  }

  /**
   * Get popular wilayas (most trips from/to)
   * @param {number} limit - Number of results
   * @returns {Promise<Array>} Popular wilayas
   */
  async getPopular(limit = 10) {
    const wilayas = await this.knex(this.tableName)
      .select('wilayas.*')
      .select(
        this.knex.raw('COUNT(trips.id) as trip_count')
      )
      .leftJoin('trips', function() {
        this.on('wilayas.code', '=', 'trips.from_wilaya_id')
          .orOn('wilayas.code', '=', 'trips.to_wilaya_id');
      })
      .where('wilayas.is_active', true)
      .groupBy('wilayas.id')
      .orderBy('trip_count', 'desc')
      .limit(limit);

    return wilayas.map(w => ({
      ...this.format(w),
      tripCount: parseInt(w.trip_count) || 0
    }));
  }

  /**
   * Calculate distance between two wilayas (approximate)
   * @param {number} fromCode - Origin wilaya code
   * @param {number} toCode - Destination wilaya code
   * @returns {Promise<Object>} Distance info
   */
  async calculateDistance(fromCode, toCode) {
    const from = await this.findByCode(fromCode);
    const to = await this.findByCode(toCode);

    if (!from || !to) {
      throw new Error('Wilaya not found');
    }

    // Haversine formula for approximate distance
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(from.latitude)) * Math.cos(this.toRad(to.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Estimate duration (assuming average speed of 80 km/h)
    const durationHours = distance / 80;
    const durationMinutes = Math.round(durationHours * 60);

    return {
      from,
      to,
      distanceKm: Math.round(distance),
      estimatedDurationMinutes: durationMinutes,
      estimatedDuration: this.formatDuration(durationMinutes)
    };
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Degrees
   * @returns {number} Radians
   */
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format duration in human readable format
   * @param {number} minutes - Duration in minutes
   * @returns {string} Formatted duration
   */
  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }

  /**
   * Format wilaya object
   * @param {Object} wilaya - Raw wilaya object
   * @returns {Object} Formatted wilaya
   */
  format(wilaya) {
    if (!wilaya) return null;

    return {
      code: wilaya.code,
      name: wilaya.name,
      nameAr: wilaya.name_ar,
      coordinates: {
        latitude: wilaya.latitude,
        longitude: wilaya.longitude
      },
      isActive: wilaya.is_active
    };
  }
}

module.exports = WilayaModel;
