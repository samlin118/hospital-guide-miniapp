const { success, fail } = require('../utils/response');
const Order = require('../models/Order');
const Guide = require('../models/Guide');
const { calculateAmount, applyCoupon } = require('../utils/pricing');
const Coupon = require('../models/Coupon');

exports.create = async (req, res) => {
  try {
    const { guide_id, hospital_id, department_id, date, start_time, duration, coupon_id } = req.body;
    const patient_id = req.user.id;
    const order_no = 'HG' + Date.now() + Math.floor(Math.random() * 9000 + 1000);
    // 使用该导诊员的每小时报价计算费用
    const guide = await Guide.findById(guide_id);
    if (!guide) return fail(res, 'Guide not found');
    const price = Number(guide.price) || 50;
    const baseAmount = calculateAmount(duration, price);
    let finalAmount = baseAmount;
    let discountAmount = 0;
    if (coupon_id) {
      const coupon = await Coupon.findById(coupon_id);
      if (coupon) {
        const result = applyCoupon(baseAmount, coupon);
        finalAmount = result.finalAmount;
        discountAmount = result.discountAmount;
      }
    }
    const order = await Order.create({
      order_no, patient_id, guide_id, hospital_id, department_id,
      date, start_time, duration, base_amount: baseAmount, coupon_id, discount_amount: discountAmount,
      final_amount: finalAmount, payment_method: null
    });
    success(res, order);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listByPatient = async (req, res) => {
  try {
    const { status, page = 1, size = 10 } = req.query;
    const result = await Order.findByPatient(req.user.id, { status, page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listByGuide = async (req, res) => {
  try {
    const { status, page = 1, size = 10 } = req.query;
    const result = await Order.findByGuide(req.user.id, { status, page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return fail(res, 'Order not found');
    if (order.patient_id !== req.user.id && order.guide_id !== req.user.id && req.user.type !== 'admin') {
      return fail(res, 'Unauthorized');
    }
    success(res, order);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.cancel = async (req, res) => {
  try {
    const orderId = req.params.orderId || req.body.order_id || req.body.orderId;
    if (!orderId) return fail(res, 'Order id required');
    const order = await Order.findById(orderId);
    if (!order) return fail(res, 'Order not found');
    if (order.status !== 0) return fail(res, 'Order cannot be cancelled');
    await Order.update(orderId, { status: 4 });
    success(res, null, 'Order cancelled');
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listAll = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = await Order.listAll({ page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.confirmComplete = async (req, res) => {
  try {
    const orderId = req.params.orderId || req.body.order_id || req.body.orderId;
    if (!orderId) return fail(res, 'Order id required');
    if (req.user.type !== 'guide' && req.user.type !== 'admin') {
      return fail(res, 'Unauthorized');
    }
    const order = await Order.findById(orderId);
    if (!order) return fail(res, 'Order not found');
    await Order.update(orderId, { status: 3 });
    success(res, null, 'Order completed');
  } catch (err) {
    fail(res, err.message);
  }
};
