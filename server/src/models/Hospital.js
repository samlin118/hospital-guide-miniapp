const db = require('./db');

const Hospital = {
  async create(data) {
    const { name, address, phone, level, image, lat, lng } = data;
    const [result] = await db.execute(
      'INSERT INTO hospitals (name, address, phone, level, image, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, phone, level, image, lat, lng]
    );
    return result;
  },

  async findAll({ search, limit } = {}) {
    let sql = 'SELECT * FROM hospitals';
    const params = [];
    if (search) {
      sql += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY created_at DESC';
    if (limit) {
      sql += ' LIMIT ?';
      params.push(limit);
    }
    const [rows] = await db.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM hospitals WHERE id = ?', [id]);
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
      `UPDATE hospitals SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM hospitals WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Hospital;
