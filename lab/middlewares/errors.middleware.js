// ============================================
// Middleware de gestión de errores
// ============================================

export function errorHandler(err, req, res, next) {
  if (err.status) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
