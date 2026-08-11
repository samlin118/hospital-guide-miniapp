const db = require('./db');

const Guide = {
  async create(data) {
    const { name, phone, id_card, address, openid, avatar } = data;
    const [result] = await db.execute(
      'INSERT INTO guides (name, phone, id_card, address, openid, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, id_card, address, openid, avatar]
    );
    return result;
  },

  async findByPhone(phone) {
    const [rows] = await db.execute('SELECT * FROM guides WHERE phone = ?', [phone]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM guides WHERE id = ?', [id]);
    return rows[0];
  },

  async findByOpenid(openid) {
    const [rows] = await db.execute('SELECT * FROM guides WHERE openid = ?', [openid]);
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return null;
    values.push(id);
    const [result] = await db.execute(
      `UPDATE guides SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  },

  async list({ page = 1, pageSize = 10, status } = {}) {
    const offset = (page - 1) * pageSize;
    let where = '';
    const params = [];
    if (status !== undefined) {
      where = 'WHERE status = ?';
      params.push(status);
    }
    const [rows] = await db.execute(
      `SELECT * FROM guides ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );
    const [countResult] = await db.execute(
      `SELECT COUNT(*) AS total FROM guides ${where}`,
      params
    );
    return { rows, total: countResult[0].total, page, pageSize };
  },

  async updateScore(id) {
    const [result] = await db.execute(
      'UPDATE guides SET score = (SELECT COALESCE(ROUND(AVG(score), 1), 0) FROM ratings WHERE guide_id = ?), service_count = (SELECT COUNT(*) FROM ratings WHERE guide_id = ?) WHERE id = ?',
      [id, id, id]
    );
    return result;
  }
};

module.exports = Guide;
