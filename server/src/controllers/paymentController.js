const { success, fail } = require('../utils/response');
const { Order, Payment } = require('../models');
const wechatPay = require('../utils/wechat-pay');
const alipay = require('../utils/alipay');

exports.createPayment = async (req, res) => {
  try {
    const { order_id, method } = req.body;
    const order = await Order.findById(order_id);
    if (!order) return fail(res, 'Order not found');
    if (order.patient_id !== req.user.id) return fail(res, 'Unauthorized');
    if (order.status !== 0) return fail(res, 'Order already paid');

    let payResult;
    if (method === 'wechat') {
      payResult = await wechatPay.createOrder({ order_no: order.order_no, amount: order.final_amount });
    } else if (method === 'alipay') {
      payResult = await alipay.createOrder({ order_no: order.order_no, amount: order.final_amount });
    } else {
      return fail(res, 'Invalid payment method');
    }

    await Payment.create({ order_id, method, amount: order.final_amount, trade_no: payResult.trade_no || '' });
    await Order.update(order_id, { payment_method: method });

    const response = method === 'wechat' ? { prepay_data: payResult.prepay_data } : { pay_url: payResult.payUrl };
    success(res, response);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.notify = async (req, res) => {
  try {
    const { order_no, method, trade_no, status } = req.body;
    if (status === 'success') {
      await Order.updateByOrderNo(order_no, { status: 1 });
      await Payment.updateByOrderNo(order_no, { status: 1, trade_no });
    }
    success(res, null, 'Payment notified');
  } catch (err) {
    fail(res, err.message);
  }
};

exports.queryPayment = async (req, res) => {
  try {
    const { orderId } = req.query;
    const payment = await Payment.findByOrderId(orderId);
    if (!payment) return fail(res, 'Payment not found');
    success(res, payment);
  } catch (err) {
    fail(res, err.message);
  }
};
