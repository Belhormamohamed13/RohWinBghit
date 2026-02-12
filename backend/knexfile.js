const path = require('path');
require('dotenv').config();

// We need the raw configuration from database.js
// But database.js exports the environment-specific config
const dbConfig = require('./src/config/database');

module.exports = {
    development: dbConfig,
    production: dbConfig,
    test: dbConfig
};
