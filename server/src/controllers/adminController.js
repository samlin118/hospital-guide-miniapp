const { success, fail } = require('../utils/response');
const { Patient, Guide, Order } = require('../models');

exports.dashboard = async (req, res) => {
  try {
    const totalPatients = await Patient.count();
    const totalGuides = await Guide.count();
    const totalOrders = await Order.count();
    const todayOrders = await Order.countToday();
    const recentOrders = await Order.recent(10);
    success(res, { totalPatients, totalGuides, totalOrders, todayOrders, recentOrders });
  } catch (err) {
    fail(res, err.message);
  }
};

exports.statistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await Order.getStats(startDate, endDate);
    success(res, stats);
  } catch (err) {
    fail(res, err.message);
  }
};
