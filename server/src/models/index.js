// 模型汇总导出（供 controllers 以 require('../models') 解构引用）
const Admin = require('./Admin');
const Coupon = require('./Coupon');
const Department = require('./Department');
const Guide = require('./Guide');
const Hospital = require('./Hospital');
const Message = require('./Message');
const Order = require('./Order');
const Patient = require('./Patient');
const Payment = require('./Payment');
const Rating = require('./Rating');
const UserCoupon = require('./UserCoupon');

module.exports = {
  Admin,
  Coupon,
  Department,
  Guide,
  Hospital,
  Message,
  Order,
  Patient,
  Payment,
  Rating,
  UserCoupon
};
