const config = require('../config');

// 按导诊员每小时报价计算费用：时长(小时) × 每小时报价
function calculateAmount(duration, price = 50) {
  const p = Number(price) || 50;
  return Math.round(p * duration * 100) / 100;
}

function applyCoupon(baseAmount, coupon) {
  const { discount, min_amount } = coupon;
  if (baseAmount >= min_amount) {
    const finalAmount = Math.round((baseAmount * discount) / 10 * 100) / 100;
    return { finalAmount, discountAmount: Math.round((baseAmount - finalAmount) * 100) / 100 };
  }
  return { finalAmount: baseAmount, discountAmount: 0 };
}

module.exports = { calculateAmount, applyCoupon };
