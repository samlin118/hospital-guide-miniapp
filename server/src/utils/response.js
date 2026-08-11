function success(res, data = null, message = '成功') {
  res.json({ code: 200, message, data });
}

function fail(res, message = '失败', code = 400) {
  res.status(code).json({ code, message, data: null });
}

module.exports = { success, fail };
