/**
 * Date Utility
 * Date formatting and manipulation helpers
 */

const moment = require('moment');

class DateUtil {
  /**
   * Format date to Algerian locale
   * @param {Date|string} date - Date to format
   * @param {string} format - Format string
   * @returns {string} Formatted date
   */
  static format(date, format = 'DD/MM/YYYY') {
    return moment(date).format(format);
  }

  /**
   * Format date with time
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date and time
   */
  static formatDateTime(date) {
    return moment(date).format('DD/MM/YYYY HH:mm');
  }

  /**
   * Format time only
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted time
   */
  static formatTime(date) {
    return moment(date).format('HH:mm');
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   * @param {Date|string} date - Date to format
   * @returns {string} Relative time
   */
  static fromNow(date) {
    return moment(date).fromNow();
  }

  /**
   * Format duration in human readable format
   * @param {number} minutes - Duration in minutes
   * @returns {string} Formatted duration
   */
  static formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} h`;
    return `${hours}h ${mins}m`;
  }

  /**
   * Get start of day
   * @param {Date|string} date - Date
   * @returns {Date} Start of day
   */
  static startOfDay(date) {
    return moment(date).startOf('day').toDate();
  }

  /**
   * Get end of day
   * @param {Date|string} date - Date
   * @returns {Date} End of day
   */
  static endOfDay(date) {
    return moment(date).endOf('day').toDate();
  }

  /**
   * Add days to date
   * @param {Date|string} date - Date
   * @param {number} days - Days to add
   * @returns {Date} New date
   */
  static addDays(date, days) {
    return moment(date).add(days, 'days').toDate();
  }

  /**
   * Add hours to date
   * @param {Date|string} date - Date
   * @param {number} hours - Hours to add
   * @returns {Date} New date
   */
  static addHours(date, hours) {
    return moment(date).add(hours, 'hours').toDate();
  }

  /**
   * Check if date is today
   * @param {Date|string} date - Date to check
   * @returns {boolean} Is today
   */
  static isToday(date) {
    return moment(date).isSame(moment(), 'day');
  }

  /**
   * Check if date is tomorrow
   * @param {Date|string} date - Date to check
   * @returns {boolean} Is tomorrow
   */
  static isTomorrow(date) {
    return moment(date).isSame(moment().add(1, 'day'), 'day');
  }

  /**
   * Check if date is in the past
   * @param {Date|string} date - Date to check
   * @returns {boolean} Is past
   */
  static isPast(date) {
    return moment(date).isBefore(moment());
  }

  /**
   * Check if date is in the future
   * @param {Date|string} date - Date to check
   * @returns {boolean} Is future
   */
  static isFuture(date) {
    return moment(date).isAfter(moment());
  }

  /**
   * Get difference between two dates in days
   * @param {Date|string} date1 - First date
   * @param {Date|string} date2 - Second date
   * @returns {number} Difference in days
   */
  static diffInDays(date1, date2) {
    return moment(date1).diff(moment(date2), 'days');
  }

  /**
   * Get difference between two dates in hours
   * @param {Date|string} date1 - First date
   * @param {Date|string} date2 - Second date
   * @returns {number} Difference in hours
   */
  static diffInHours(date1, date2) {
    return moment(date1).diff(moment(date2), 'hours');
  }

  /**
   * Get difference between two dates in minutes
   * @param {Date|string} date1 - First date
   * @param {Date|string} date2 - Second date
   * @returns {number} Difference in minutes
   */
  static diffInMinutes(date1, date2) {
    return moment(date1).diff(moment(date2), 'minutes');
  }

  /**
   * Parse date string
   * @param {string} dateString - Date string
   * @param {string} format - Format
   * @returns {Date} Parsed date
   */
  static parse(dateString, format = 'DD/MM/YYYY') {
    return moment(dateString, format).toDate();
  }

  /**
   * Get current timestamp
   * @returns {number} Timestamp
   */
  static now() {
    return Date.now();
  }

  /**
   * Get ISO string
   * @param {Date|string} date - Date
   * @returns {string} ISO string
   */
  static toISOString(date) {
    return moment(date).toISOString();
  }

  /**
   * Get trip date display
   * @param {Date|string} date - Trip date
   * @returns {string} Formatted display
   */
  static getTripDateDisplay(date) {
    if (this.isToday(date)) {
      return 'Aujourd\'hui';
    }
    if (this.isTomorrow(date)) {
      return 'Demain';
    }
    return this.format(date, 'dddd D MMMM');
  }

  /**
   * Get available trip dates (next 30 days)
   * @returns {Array} Date options
   */
  static getAvailableTripDates() {
    const dates = [];
    const today = moment().startOf('day');
    
    for (let i = 0; i < 30; i++) {
      const date = moment(today).add(i, 'days');
      dates.push({
        value: date.format('YYYY-MM-DD'),
        label: i === 0 ? 'Aujourd\'hui' : 
               i === 1 ? 'Demain' : 
               date.format('dddd D MMMM'),
        dayName: date.format('dddd'),
        date: date.format('D MMMM')
      });
    }
    
    return dates;
  }

  /**
   * Get time slots for trip departure
   * @returns {Array} Time options
   */
  static getTimeSlots() {
    const slots = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const label = moment(time, 'HH:mm').format('HH:mm');
        slots.push({ value: time, label });
      }
    }
    
    return slots;
  }
}

module.exports = DateUtil;
