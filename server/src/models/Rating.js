const db = require('./db');

const Rating = {
  async create(data) {
    const { order_id, patient_id, guide_id, score, content, anonymous } = data;
    const [result] = await db.execute(
      'INSERT INTO ratings (order_id, patient_id, guide_id, score, content, anonymous) VALUES (?, ?, ?, ?, ?, ?)',
      [order_id, patient_id, guide_id, score, content, anonymous || 0]
    );
    return result;
  },

  async findByGuide(guideId, { page = 1, pageSize = 10 } = {}) {
    const offset = (page - 1) * pageSize;
    const [rows] = await db.execute(
      `SELECT r.*, p.name AS patient_name, p.avatar AS patient_avatar
       FROM ratings r
       LEFT JOIN patients p ON r.patient_id = p.id
       WHERE r.guide_id = ?
       ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
      [guideId, pageSize, offset]
    );
    const [countResult] = await db.execute(
      'SELECT COUNT(*) AS total FROM ratings WHERE guide_id = ?',
      [guideId]
    );
    return { rows, total: countResult[0].total, page, pageSize };
  },

  async findByPatient(patientId, { page = 1, pageSize = 10 } = {}) {
    const offset = (page - 1) * pageSize;
    const [rows] = await db.execute(
      `SELECT r.*, g.name AS guide_name
       FROM ratings r
       LEFT JOIN guides g ON r.guide_id = g.id
       WHERE r.patient_id = ?
       ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
      [patientId, pageSize, offset]
    );
    const [countResult] = await db.execute(
      'SELECT COUNT(*) AS total FROM ratings WHERE patient_id = ?',
      [patientId]
    );
    return { rows, total: countResult[0].total, page, pageSize };
  },

  async checkIfRated(orderId) {
    const [rows] = await db.execute('SELECT id FROM ratings WHERE order_id = ?', [orderId]);
    return rows.length > 0;
  },

  async findByOrder(orderId) {
    const [rows] = await db.execute('SELECT * FROM ratings WHERE order_id = ?', [orderId]);
    return rows[0];
  }
};

module.exports = Rating;
