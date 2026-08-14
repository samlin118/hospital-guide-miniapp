const fs = require('fs');
const path = require('path');
const { success, fail } = require('../utils/response');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'avatars');

exports.avatar = async (req, res) => {
  try {
    const { base64, ext } = req.body || {};
    if (!base64) return fail(res, '缺少图片数据');
    const buffer = Buffer.from(base64, 'base64');
    if (!buffer.length) return fail(res, '图片数据无效');
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const filename = Date.now() + '-' + Math.floor(Math.random() * 100000) + '.' + (ext || 'png');
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
    success(res, { url: '/uploads/avatars/' + filename });
  } catch (err) {
    fail(res, err.message);
  }
};
