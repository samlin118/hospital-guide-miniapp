const db = require('./db');

const Message = {
  async create(data) {
    const { user_id, role, content } = data;
    const [result] = await db.execute(
      'INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)',
      [user_id, role, content]
    );
    return result;
  },

  async findByUser(userId, role, { page = 1, pageSize = 10 } = {}) {
    const offset = (page - 1) * pageSize;
    const [rows] = await db.execute(
      'SELECT * FROM messages WHERE user_id = ? AND role = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, role, pageSize, offset]
    );
    const [countResult] = await db.execute(
      'SELECT COUNT(*) AS total FROM messages WHERE user_id = ? AND role = ?',
      [userId, role]
    );
    return { rows, total: countResult[0].total, page, pageSize };
  },

  async findAll({ page = 1, pageSize = 10 } = {}) {
    const offset = (page - 1) * pageSize;
    const [rows] = await db.execute(
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    const [countResult] = await db.execute('SELECT COUNT(*) AS total FROM messages');
    return { rows, total: countResult[0].total, page, pageSize };
  },

  async reply(id, replyText) {
    const [result] = await db.execute(
      'UPDATE messages SET reply = ?, replied = 1 WHERE id = ?',
      [replyText, id]
    );
    return result;
  }
};

module.exports = Message;
