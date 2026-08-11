const { success, fail } = require('../utils/response');
const { Coupon, UserCoupon } = require('../models');

exports.create = async (req, res) => {
  try {
    const { name, discount, min_amount, total_count, expire_days } = req.body;
    const coupon = await Coupon.create({ name, discount, min_amount, total_count, expire_days });
    success(res, coupon);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.list = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    success(res, coupons);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.issueToUser = async (req, res) => {
  try {
    const { user_id, role, coupon_id } = req.body;
    const coupon = await Coupon.findById(coupon_id);
    if (!coupon) return fail(res, 'Coupon not found');

    const expire_at = new Date();
    expire_at.setDate(expire_at.getDate() + coupon.expire_days);

    const userCoupon = await UserCoupon.create({ user_id, role, coupon_id, expire_at });
    success(res, userCoupon);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.myCoupons = async (req, res) => {
  try {
    const coupons = await UserCoupon.findAvailable(req.user.id, req.user.type);
    success(res, coupons);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listAll = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    success(res, coupons);
  } catch (err) {
    fail(res, err.message);
  }
};
