const db = require('./db');

const Department = {
  async create(data) {
    const { hospital_id, name, description } = data;
    const [result] = await db.execute(
      'INSERT INTO departments (hospital_id, name, description) VALUES (?, ?, ?)',
      [hospital_id, name, description]
    );
    return result;
  },

  async findByHospital(hospitalId) {
    const [rows] = await db.execute('SELECT * FROM departments WHERE hospital_id = ? ORDER BY id', [hospitalId]);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM departments WHERE id = ?', [id]);
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
      `UPDATE departments SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM departments WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Department;
