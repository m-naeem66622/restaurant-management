const throwError = (status, statusCode, message, identifier) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.identifier = identifier;
  error.status = status;

  throw error;
};

module.exports = throwError;
