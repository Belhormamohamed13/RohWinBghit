let ioInstance = null;

function registerIo(io) {
  ioInstance = io;
}

function emitDomainEvent(eventName, payload) {
  if (!ioInstance) return;
  ioInstance.emit(eventName, payload);
}

module.exports = { registerIo, emitDomainEvent };

