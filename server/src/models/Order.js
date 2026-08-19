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
              d.name AS department_name,
              c.name AS coupon_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       LEFT JOIN guides g ON o.guide_id = g.id
       LEFT JOIN hospitals h ON o.hospital_id = h.id
       LEFT JOIN departments d ON o.department_id = d.id
       LEFT JOIN coupons c ON o.coupon_id = c.id
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
    let where = 'WHERE (o.guide_id = ? OR (o.status = 0 AND o.guide_id IS NULL))';
    const params = [guideId];
    if (status !== undefined) {
      where += ' AND o.status = ?';
      params.push(status);
    }
    const countParams = [...params];
    const [rows] = await db.execute(
      `SELECT o.*, p.name AS patient_name, p.phone AS patient_phone, p.avatar AS patient_avatar,
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

  // 某医院+科室下的患者导诊订单（含患者信息）
  async findByHospitalDepartment(hospitalId, departmentId) {
    const [rows] = await db.execute(
      `SELECT o.*, p.name AS patient_name, p.phone AS patient_phone, p.avatar AS patient_avatar,
              g.name AS guide_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       LEFT JOIN guides g ON o.guide_id = g.id
       WHERE o.hospital_id = ? AND o.department_id = ?
       ORDER BY o.created_at DESC`,
      [hospitalId, departmentId]
    );
    return rows;
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

  // 导诊员接单：待导诊(0) → 进行中(2)，并原子关联接单导诊员（防止并发重复接单）
  async startByGuide(orderId, guideId) {
    const [result] = await db.execute(
      'UPDATE orders SET status = 2, guide_id = ? WHERE id = ? AND status = 0',
      [guideId, orderId]
    );
    return result.affectedRows;
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
  },

  async count() {
    const [[{ total }]] = await db.execute('SELECT COUNT(*) AS total FROM orders');
    return total;
  },

  async countToday() {
    const [[{ total }]] = await db.execute('SELECT COUNT(*) AS total FROM orders WHERE DATE(created_at) = CURDATE()');
    return total;
  },

  async recent(limit = 10) {
    const [rows] = await db.execute(
      `SELECT o.*, p.name AS patient_name, g.name AS guide_name, h.name AS hospital_name
       FROM orders o
       LEFT JOIN patients p ON o.patient_id = p.id
       LEFT JOIN guides g ON o.guide_id = g.id
       LEFT JOIN hospitals h ON o.hospital_id = h.id
       ORDER BY o.created_at DESC LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async getStats(startDate, endDate) {
    let where = '';
    const params = [];
    if (startDate) {
      where += ' WHERE DATE(created_at) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += (where ? ' AND ' : 'WHERE ') + 'DATE(created_at) <= ?';
      params.push(endDate);
    }
    const [rows] = await db.execute(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count, COALESCE(SUM(final_amount), 0) AS amount
       FROM orders ${where}
       GROUP BY DATE(created_at) ORDER BY date`,
      params
    );
    return rows;
  },

  async updateByOrderNo(orderNo, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return null;
    values.push(orderNo);
    const [result] = await db.execute(
      `UPDATE orders SET ${fields.join(', ')} WHERE order_no = ?`,
      values
    );
    return result;
  }
};

module.exports = Order;
