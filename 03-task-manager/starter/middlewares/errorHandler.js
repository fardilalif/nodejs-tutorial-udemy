const { customAPIError } = require("../errors/customError.js");

const errorHandler = (err, req, res, next) => {
  if (err instanceof customAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).json({ msg: "Something is wrong, please try again" });
};

module.exports = errorHandler;
