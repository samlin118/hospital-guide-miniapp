const db = require('./db');

const Coupon = {
  async create(data) {
    const { name, discount, min_amount, total_count, remain_count, expire_days } = data;
    const [result] = await db.execute(
      'INSERT INTO coupons (name, discount, min_amount, total_count, remain_count, expire_days) VALUES (?, ?, ?, ?, ?, ?)',
      [name, discount, min_amount, total_count, remain_count, expire_days]
    );
    return result;
  },

  async findAll() {
    const [rows] = await db.execute('SELECT * FROM coupons ORDER BY created_at DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM coupons WHERE id = ?', [id]);
    return rows[0];
  },

  async updateRemainCount(id) {
    const [result] = await db.execute(
      'UPDATE coupons SET remain_count = remain_count - 1 WHERE id = ? AND remain_count > 0',
      [id]
    );
    return result;
  }
};

module.exports = Coupon;
