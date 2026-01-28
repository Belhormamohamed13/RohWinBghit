function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || (status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR");

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message: err.message || "Unexpected error",
    },
  });
}

module.exports = { errorHandler };

