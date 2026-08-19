const api = require('../../../utils/api');
const util = require('../../../utils/util');
const { CONFIG, calculateAmount } = require('../../../utils/config');

Page({
  data: {
    guideId: '',
    guideName: '',
    hospitalId: '',
    hospitalName: '',
    deptId: '',
    deptName: '',
    date: '',
    startTime: '',
    duration: 2,
    guidePrice: 50,
    baseAmount: 50,
    discountAmount: 0,
    finalAmount: 50,
    selectedCoupon: null,
    couponCount: 0,
    coupons: []
  },

  onLoad(options) {
    const guideId = options.guideId || '';
    const guideName = options.guideName || '';
    const hospitalId = options.hospitalId || '';
    const hospitalName = options.hospitalName || '';
    const deptId = options.deptId || '';
    const deptName = options.deptName || '';
    const guidePrice = parseFloat(options.price) || 50;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = util.formatDate(tomorrow);
    const startTime = '09:00';

    const baseAmount = calculateAmount(this.data.duration, guidePrice);
    const finalAmount = baseAmount;

    this.setData({
      guideId, guideName, hospitalId, hospitalName, deptId, deptName, guidePrice,
      date, startTime, baseAmount, finalAmount
    });

    this.loadCoupons();
  },

  loadCoupons() {
    api.getMyCoupons().then(res => {
      if (res.code === 200 && res.data) {
        const coupons = res.data;
        this.setData({ coupons, couponCount: coupons.length });
      }
    }).catch(() => {});
  },

  onDateChange(e) {
    this.setData({ date: e.detail.value });
  },

  onTimeChange(e) {
    this.setData({ startTime: e.detail.value });
  },

  onDuration(e) {
    const duration = parseInt(e.currentTarget.dataset.val, 10);
    this.setData({ duration });
    this.recalculatePrice();
  },

  onSelectCoupon() {
    if (this.data.coupons.length === 0) {
      util.showError('暂无可用优惠券');
      return;
    }
    wx.navigateTo({
      url: '/pages/coupon/coupon?returnAmount=1',
      events: {
        acceptData: (data) => {
          if (data) {
            this.setData({ selectedCoupon: data });
            this.recalculatePrice();
          }
        }
      }
    });
  },

  recalculatePrice() {
    const baseAmount = calculateAmount(this.data.duration, this.data.guidePrice);
    const selectedCoupon = this.data.selectedCoupon;
    let discountAmount = 0;
    if (selectedCoupon) {
      discountAmount = selectedCoupon.discount || 0;
    }
    const finalAmount = Math.max(0, baseAmount - discountAmount);
    this.setData({ baseAmount, discountAmount, finalAmount });
  },

  onSubmit() {
    const { guideId, hospitalId, deptId, date, startTime, duration, finalAmount, selectedCoupon } = this.data;
    if (!date || !startTime || !duration) {
      util.showError('请完善订单信息');
      return;
    }

    util.showLoading('提交中...');
    const data = {
      guide_id: guideId,
      hospital_id: hospitalId,
      department_id: deptId,
      date,
      start_time: startTime,
      duration,
      final_amount: finalAmount
    };
    if (selectedCoupon) {
      data.coupon_id = selectedCoupon.id;
    }

    api.createOrder(data).then(res => {
      util.hideLoading();
      if (res.code === 200 && res.data) {
        util.showSuccess('下单成功，等待导诊员接单');
        const orderId = res.data.id || res.data.insertId || res.data.order_id;
        // 先服务后付款：下单后进入订单详情（待导诊），导诊员完成导诊后才去支付
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/order/detail/detail?orderId=${orderId}`
          });
        }, 1000);
      } else {
        util.showError(res.message || '创建订单失败');
      }
    }).catch(err => {
      util.hideLoading();
      util.showError(err.message || '网络错误');
    });
  }
});