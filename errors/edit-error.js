class EditError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.message = message;
  }
}

module.exports = EditError;
