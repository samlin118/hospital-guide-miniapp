const db = require('./db');

const Patient = {
  async create(data) {
    const [result] = await db.execute(
      'INSERT INTO patients (name, phone, id_card, password, address, openid, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.name, data.phone, data.id_card, data.password, data.address, data.openid, data.avatar]
    );
    return result.insertId;
  },

  async findByPhone(phone) {
    const [rows] = await db.execute('SELECT * FROM patients WHERE phone = ?', [phone]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT id, name, phone, address, avatar, openid, created_at FROM patients WHERE id = ?', [id]);
    return rows[0];
  },

  async findByOpenid(openid) {
    const [rows] = await db.execute('SELECT * FROM patients WHERE openid = ?', [openid]);
    return rows[0];
  },

  // 某导诊员的患者（有订单关系的患者，含订单数/最近下单时间）
  async findByGuide(guideId) {
    const [rows] = await db.execute(
      `SELECT p.id, p.name, p.phone, p.address, p.avatar,
              COUNT(o.id) AS order_count,
              MAX(o.created_at) AS last_order_at
       FROM patients p
       JOIN orders o ON o.patient_id = p.id
       WHERE o.guide_id = ?
       GROUP BY p.id
       ORDER BY last_order_at DESC`,
      [guideId]
    );
    return rows;
  },

  // 某医院+科室下需要服务的患者（在该院该科有订单的患者）
  async findByHospitalDepartment(hospitalId, departmentId) {
    const [rows] = await db.execute(
      `SELECT p.id, p.name, p.phone, p.address, p.avatar,
              COUNT(o.id) AS order_count,
              MAX(o.created_at) AS last_order_at
       FROM patients p
       JOIN orders o ON o.patient_id = p.id
       WHERE o.hospital_id = ? AND o.department_id = ?
       GROUP BY p.id
       ORDER BY last_order_at DESC`,
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
    if (fields.length === 0) return;
    values.push(id);
    await db.execute(`UPDATE patients SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  async list(page = 1, size = 20) {
    const offset = (page - 1) * size;
    const [rows] = await db.execute(
      'SELECT id, name, phone, address, created_at FROM patients ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [size, offset]
    );
    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM patients');
    return { rows, total };
  },

  async count() {
    const [[{ total }]] = await db.execute('SELECT COUNT(*) AS total FROM patients');
    return total;
  }
};

module.exports = Patient;
