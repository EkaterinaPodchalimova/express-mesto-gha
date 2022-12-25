class DeleteCardError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
    this.message = message;
  }
}

module.exports = DeleteCardError;
