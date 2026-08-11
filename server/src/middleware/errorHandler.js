function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    code: status,
    message: err.message || '服务器内部错误',
  });
}

module.exports = errorHandler;
