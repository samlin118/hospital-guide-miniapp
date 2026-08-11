const db = require('./db');

const Admin = {
  async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM admins WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = Admin;
