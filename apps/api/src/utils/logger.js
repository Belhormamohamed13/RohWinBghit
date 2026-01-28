function info(message) {
  // eslint-disable-next-line no-console
  console.log(`[INFO] ${new Date().toISOString()} ${message}`);
}

function warn(message) {
  // eslint-disable-next-line no-console
  console.warn(`[WARN] ${new Date().toISOString()} ${message}`);
}

function error(message) {
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${new Date().toISOString()} ${message}`);
}

const logger = { info, warn, error };

module.exports = { logger };

