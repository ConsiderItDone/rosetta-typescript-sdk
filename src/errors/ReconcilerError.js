
// ReconcilerError.js
class ReconcilerError extends Error {
  constructor(message, type, filename, lineNumber) {
    super(message, filename, lineNumber);
    this.type = type;
    this.name = 'ReconcilerError';
  }
}
module.exports = ReconcilerError;