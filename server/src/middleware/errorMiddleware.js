export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.name === "ZodError" ? 400 : err.statusCode || 500;
  const message =
    err.name === "ZodError"
      ? err.issues?.[0]?.message || "Validation failed"
      : err.message || "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
  });
};
