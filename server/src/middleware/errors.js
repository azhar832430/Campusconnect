export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `A record with this ${field} already exists.` });
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    const message = err.name === 'ValidationError'
      ? Object.values(err.errors).map(e => e.message).join('. ')
      : 'The supplied record ID is invalid.';
    return res.status(400).json({ success: false, message });
  }
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.status ? err.message : 'An unexpected server error occurred.' });
}
