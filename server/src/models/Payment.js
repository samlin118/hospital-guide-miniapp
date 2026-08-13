const db = require('./db');

const Payment = {
  async create(data) {
    const { order_id, method, trade_no, amount } = data;
    const [result] = await db.execute(
      'INSERT INTO payments (order_id, method, trade_no, amount) VALUES (?, ?, ?, ?)',
      [order_id, method, trade_no, amount]
    );
    return result;
  },

  async findByOrderId(orderId) {
    const [rows] = await db.execute(
      'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC',
      [orderId]
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
      `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  },

  async updateByOrderNo(orderNo, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`p.${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return null;
    values.push(orderNo);
    const [result] = await db.execute(
      `UPDATE payments p JOIN orders o ON p.order_id = o.id SET ${fields.join(', ')} WHERE o.order_no = ?`,
      values
    );
    return result;
  }
};

module.exports = Payment;
