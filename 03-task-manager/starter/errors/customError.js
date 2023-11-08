class customAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createCustomError = (message, statusCode) => {
  return new customAPIError(message, statusCode);
};

module.exports = {
  customAPIError,
  createCustomError,
};
