const { success, fail } = require('../utils/response');
const { Rating, Order, Guide } = require('../models');

exports.create = async (req, res) => {
  try {
    const { order_id, score, content, anonymous } = req.body;
    if (score < 1 || score > 5) return fail(res, 'Score must be between 1 and 5');

    const order = await Order.findById(order_id);
    if (!order) return fail(res, 'Order not found');
    if (order.status !== 3) return fail(res, 'Order not completed');
    if (order.patient_id !== req.user.id) return fail(res, 'Unauthorized');

    const existing = await Rating.findByOrder(order_id);
    if (existing) return fail(res, 'Already rated');

    const rating = await Rating.create({ order_id, guide_id: order.guide_id, patient_id: req.user.id, score, content, anonymous: anonymous || false });

    await Guide.updateScore(order.guide_id);

    success(res, rating);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listByGuide = async (req, res) => {
  try {
    const guideId = req.params.guideId || req.query.guideId;
    const { page = 1, size = 10 } = req.query;
    const result = await Rating.findByGuide(guideId, { page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listByPatient = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = await Rating.findByPatient(req.user.id, { page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.check = async (req, res) => {
  try {
    const { orderId } = req.query;
    const rating = await Rating.findByOrder(orderId);
    success(res, { rated: !!rating, rating });
  } catch (err) {
    fail(res, err.message);
  }
};
