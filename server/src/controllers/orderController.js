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
    // 用所选导诊员的报价估算费用（可选）；待导诊订单不预分配导诊员，导诊员接单时才关联
    let price = 50;
    if (guide_id) {
      const guide = await Guide.findById(guide_id);
      if (guide) price = Number(guide.price) || 50;
    }
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
      order_no, patient_id, guide_id: null, hospital_id, department_id,
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
    // 待导诊(0)订单未分配导诊员，任何导诊员可查看以便接单
    if (order.patient_id !== req.user.id && order.guide_id !== req.user.id && req.user.type !== 'admin' && !(req.user.type === 'guide' && order.status === 0)) {
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

// 导诊员查看某医院+科室下的患者导诊订单
exports.listByHospitalDepartment = async (req, res) => {
  try {
    if (req.user.type !== 'guide') return fail(res, 'Unauthorized');
    const { hospitalId, departmentId } = req.query;
    if (!hospitalId || !departmentId) return fail(res, 'hospitalId and departmentId required');
    const rows = await Order.findByHospitalDepartment(hospitalId, departmentId);
    success(res, { rows, total: rows.length });
  } catch (err) {
    fail(res, err.message);
  }
};

// 导诊员接单：待导诊(0) → 进行中(2)，并关联接单导诊员（原子更新防并发抢单）
exports.startService = async (req, res) => {
  try {
    const orderId = req.params.orderId || req.body.order_id || req.body.orderId;
    if (!orderId) return fail(res, 'Order id required');
    if (req.user.type !== 'guide' && req.user.type !== 'admin') return fail(res, 'Unauthorized');
    const order = await Order.findById(orderId);
    if (!order) return fail(res, 'Order not found');
    if (order.status !== 0) return fail(res, '订单只能在待导诊状态开始服务');
    const affected = await Order.startByGuide(orderId, req.user.id);
    if (!affected) return fail(res, '订单已被其他导诊员接单');
    success(res, null, '已开始服务');
  } catch (err) {
    fail(res, err.message);
  }
};

// 导诊员完成导诊：进行中(2) → 待支付(1)（等待患者支付）
exports.confirmComplete = async (req, res) => {
  try {
    const orderId = req.params.orderId || req.body.order_id || req.body.orderId;
    if (!orderId) return fail(res, 'Order id required');
    if (req.user.type !== 'guide' && req.user.type !== 'admin') return fail(res, 'Unauthorized');
    const order = await Order.findById(orderId);
    if (!order) return fail(res, 'Order not found');
    if (order.guide_id !== req.user.id && req.user.type !== 'admin') return fail(res, 'Unauthorized');
    if (order.status !== 2) return fail(res, '订单只能在进行中状态完成导诊');
    await Order.update(orderId, { status: 1 });
    success(res, null, '已完成导诊，等待患者支付');
  } catch (err) {
    fail(res, err.message);
  }
};
