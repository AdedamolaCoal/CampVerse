// catches errors and returns status code and a message
class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
module.exports = ExpressError;
