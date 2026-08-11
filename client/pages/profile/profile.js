const api = require('../../utils/api');
const util = require('../../utils/util');
const app = getApp();

Page({
  data: {
    userInfo: {},
    roleText: '',
    isAdmin: false,
    orderCounts: {}
  },

  onShow() {
    const userInfo = app.globalData.userInfo || {};
    const role = userInfo.role || '';
    const roleMap = { 'patient': '患者', 'guide': '导诊员', 'admin': '管理员' };
    this.setData({
      userInfo,
      roleText: roleMap[role] || '',
      isAdmin: role === 'admin'
    });
    this.loadOrderCounts();
  },

  loadOrderCounts() {
    const statuses = [0, 1, 3, 4];
    const counts = {};
    statuses.forEach(s => counts[s] = 0);
    api.getMyOrders({}).then(res => {
      if (res.data) {
        res.data.forEach(order => {
          if (order.status !== undefined) {
            counts[order.status] = (counts[order.status] || 0) + 1;
          }
        });
      }
      this.setData({ orderCounts: counts });
    }).catch(() => {});
  },

  onOrderTap(e) {
    const status = e.currentTarget.dataset.status;
    wx.switchTab({ url: `/pages/order/order?status=${status}` });
  },

  onMyOrders() {
    wx.switchTab({ url: '/pages/order/order' });
  },

  onMyCoupons() {
    wx.navigateTo({ url: '/pages/coupon/coupon' });
  },

  onMyMessages() {
    wx.switchTab({ url: '/pages/message/message' });
  },

  onAdmin() {
    wx.navigateTo({ url: '/pages/admin/dashboard/dashboard' });
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
