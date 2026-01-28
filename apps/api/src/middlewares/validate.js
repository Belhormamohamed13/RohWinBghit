function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: parsed.error.flatten()
        }
      });
    }

    req.validated = parsed.data;
    return next();
  };
}

module.exports = { validate };

