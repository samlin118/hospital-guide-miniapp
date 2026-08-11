const db = require('./db');

const UserCoupon = {
  async create(userId, role, couponId, expireAt) {
    const [result] = await db.execute(
      'INSERT INTO user_coupons (user_id, role, coupon_id, expire_at) VALUES (?, ?, ?, ?)',
      [userId, role, couponId, expireAt]
    );
    return result;
  },

  async findAvailable(userId, role) {
    const [rows] = await db.execute(
      `SELECT uc.*, c.name, c.discount, c.min_amount
       FROM user_coupons uc
       JOIN coupons c ON uc.coupon_id = c.id
       WHERE uc.user_id = ? AND uc.role = ? AND uc.used = 0 AND uc.expire_at > NOW()
       ORDER BY uc.expire_at ASC`,
      [userId, role]
    );
    return rows;
  },

  async markUsed(id, orderId) {
    const [result] = await db.execute(
      'UPDATE user_coupons SET used = 1, used_at = NOW() WHERE id = ? AND used = 0',
      [id]
    );
    return result;
  }
};

module.exports = UserCoupon;
