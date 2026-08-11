const db = require('./db');

const Order = {
  async create(data) {
    const order_no = 'HG' + Date.now() + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { patient_id, guide_id, hospital_id, department_id, date, start_time, duration, base_amount, coupon_id, discount_amount, final_amount, payment_method } = data;
    const [result] = await db.execute(
      'INSERT INTO orders (order_no, patient_id, guide_id, hospital_id, department_id, date, start_time, duration, base_amount, coupon_id, discount_amount, final_amount, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [order_no, patient_id, guide_id, hospital_id, department_id, date, start_time, duration, base_amount, coupon_id, discount_amount || 0, final_amount, payment_method]
    );
    return { ...result, order_no };
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT o.*, p.name AS patient_name, p.phone AS patient_phone,
              g.name AS guide_name, g.phone AS guide_phone,
              h.name AS hospital_name, h.address AS hospital_address,
              d.name AS department_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       LEFT JOIN guides g ON o.guide_id = g.id
       LEFT JOIN hospitals h ON o.hospital_id = h.id
       LEFT JOIN departments d ON o.department_id = d.id
       WHERE o.id = ?`,
      [id]
    );
    return rows[0];
  },

  async findByPatient(patientId, { status, page = 1, pageSize = 10 } = {}) {
    const offset = (page - 1) * pageSize;
    let where = 'WHERE o.patient_id = ?';
    const params = [patientId];
    if (status !== undefined) {
      where += ' AND o.status = ?';
      params.push(status);
    }
    const countParams = [...params];
    const [rows] = await db.execute(
      `SELECT o.*, g.name AS guide_name, h.name AS hospital_name, d.name AS department_name
       FROM orders o
       LEFT JOIN guides g ON o.guide_id = g.id
       LEFT JOIN hospitals h ON o.hospital_id = h.id
       LEFT JOIN departments d ON o.department_id = d.id
       ${where}
       ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );
    const [countResult] = await db.execute(
      `SELECT COUNT(*) AS total FROM orders o ${where}`,
      countParams
    );
    return { rows, total: countResult[0].total, page, pageSize };
  },

  async findByGuide(guideId, { status, page = 1, pageSize = 10 } = {}) {
    const offset = (page - 1) * pageSize;
    let where = 'WHERE o.guide_id = ?';
    const params = [guideId];
    if (status !== undefined) {
      where += ' AND o.status = ?';
      params.push(status);
    }
    const countParams = [...params];
    const [rows] = await db.execute(
      `SELECT o.*, p.name AS patient_name, p.phone AS patient_phone,
              h.name AS hospital_name, d.name AS department_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       LEFT JOIN hospitals h ON o.hospital_id = h.id
       LEFT JOIN departments d ON o.department_id = d.id
       ${where}
       ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );
    const [countResult] = await db.execute(
      `SELECT COUNT(*) AS total FROM orders o ${where}`,
      countParams
    );
    return { rows, total: countResult[0].total, page, pageSize };
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
      `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  },

  async findByOrderNo(orderNo) {
    const [rows] = await db.execute(
      `SELECT o.*, p.name AS patient_name, g.name AS guide_name,
              h.name AS hospital_name, d.name AS department_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       LEFT JOIN guides g ON o.guide_id = g.id
       LEFT JOIN hospitals h ON o.hospital_id = h.id
       LEFT JOIN departments d ON o.department_id = d.id
       WHERE o.order_no = ?`,
      [orderNo]
    );
    return rows[0];
  },

  async listAll({ page = 1, pageSize = 10, status } = {}) {
    const offset = (page - 1) * pageSize;
    let where = '';
    const params = [];
    if (status !== undefined) {
      where = 'WHERE o.status = ?';
      params.push(status);
    }
    const countParams = [...params];
    const [rows] = await db.execute(
      `SELECT o.*, p.name AS patient_name, p.phone AS patient_phone,
              g.name AS guide_name, g.phone AS guide_phone,
              h.name AS hospital_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       LEFT JOIN guides g ON o.guide_id = g.id
       LEFT JOIN hospitals h ON o.hospital_id = h.id
       ${where}
       ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );
    const [countResult] = await db.execute(
      `SELECT COUNT(*) AS total FROM orders o ${where}`,
      countParams
    );
    return { rows, total: countResult[0].total, page, pageSize };
  },

  async countByStatus() {
    const [rows] = await db.execute(
      'SELECT status, COUNT(*) AS count FROM orders GROUP BY status'
    );
    return rows;
  }
};

module.exports = Order;
