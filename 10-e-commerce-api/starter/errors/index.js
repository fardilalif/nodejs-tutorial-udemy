const BadRequestError = require('./bad-request.js');
const NotFoundError = require('./not-found.js');
const UnauthenticatedError = require('./unauthenticated.js');
const UnauthorizedError = require('./unauthorized.js');

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
};
