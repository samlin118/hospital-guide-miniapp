const { success, fail } = require('../utils/response');
const Order = require('../models/Order');
const { calculateAmount, applyCoupon } = require('../utils/pricing');
const Coupon = require('../models/Coupon');

exports.create = async (req, res) => {
  try {
    const { guide_id, hospital_id, department_id, date, start_time, duration, coupon_id } = req.body;
    const patient_id = req.user.id;
    const order_no = 'HG' + Date.now() + Math.floor(Math.random() * 9000 + 1000);
    const baseAmount = calculateAmount(duration);
    let finalAmount = baseAmount;
    let discountAmount = 0;
    if (coupon_id) {
      const coupon = await Coupon.findById(coupon_id);
      if (coupon) {
        finalAmount = applyCoupon(baseAmount, coupon);
        discountAmount = baseAmount - finalAmount;
      }
    }
    const order = await Order.create({
      order_no, patient_id, guide_id, hospital_id, department_id,
      date, start_time, duration, amount: baseAmount, discount_amount: discountAmount,
      final_amount: finalAmount, status: 0
    });
    success(res, order);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listByPatient = async (req, res) => {
  try {
    const { status, page = 1, size = 10 } = req.query;
    const result = await Order.findByPatient(req.user.id, status, Number(page), Number(size));
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listByGuide = async (req, res) => {
  try {
    const { status, page = 1, size = 10 } = req.query;
    const result = await Order.findByGuide(req.user.id, status, Number(page), Number(size));
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
    const { orderId } = req.params;
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
    const result = await Order.list(Number(page), Number(size));
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.confirmComplete = async (req, res) => {
  try {
    const { orderId } = req.params;
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
