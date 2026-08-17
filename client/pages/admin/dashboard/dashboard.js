const api = require('../../../utils/api');
const util = require('../../../utils/util');
const app = getApp();

Page({
  data: {
    stats: { patients: 0, guides: 0, orders: 0, todayOrders: 0 }
  },

  onLoad() {
    api.adminDashboard().then(res => {
      if (res.data) {
        this.setData({ stats: res.data });
      }
    }).catch(() => {});
  },

  onHospitalReg() {
    wx.navigateTo({ url: '/pages/admin/hospital-reg/hospital-reg' });
  },

  onGuideAssign() {
    wx.navigateTo({ url: '/pages/admin/guide-assign/guide-assign' });
  },

  onCouponMgmt() {
    wx.navigateTo({ url: '/pages/admin/coupon-mgmt/coupon-mgmt' });
  },

  onOrderMgmt() {
    wx.navigateTo({ url: '/pages/admin/order-mgmt/order-mgmt' });
  },

  onMessageMgmt() {
    wx.navigateTo({ url: '/pages/admin/message-mgmt/message-mgmt' });
  }
});
