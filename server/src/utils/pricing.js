const config = require('../config');

function calculateAmount(duration) {
  if (duration <= 2) return 50;
  return 50 + (duration - 2) * 10;
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
