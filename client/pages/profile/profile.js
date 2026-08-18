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
    const isGuide = app.globalData.role === 'guide';
    const apiCall = isGuide ? api.getGuideOrders({}) : api.getMyOrders({});
    apiCall.then(res => {
      if (res.data) {
        const rows = res.data.rows || res.data.list || (Array.isArray(res.data) ? res.data : []);
        rows.forEach(order => {
          if (order.status !== undefined) {
            counts[order.status] = (counts[order.status] || 0) + 1;
          }
        });
      }
      this.setData({ orderCounts: counts });
    }).catch(() => {});
  },

  onAvatarTap() {
    const role = app.globalData.role || '';
    if (!role || role === 'admin') {
      wx.showToast({ title: '登录后即可更换头像', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: (res) => {
        const filePath = res.tempFiles[0].tempFilePath;
        wx.getFileSystemManager().readFile({
          filePath,
          encoding: 'base64',
          success: (r) => {
            const ext = ((filePath.split('.').pop()) || 'png').toLowerCase();
            api.uploadAvatar({ base64: r.data, ext }).then((res2) => {
              if (res2.code === 200 && res2.data) {
                const origin = (app.globalData.serverUrl || '').replace(/\/api$/, '');
                const avatar = origin + res2.data.url;
                const update = role === 'guide'
                  ? api.updateGuideProfile({ avatar })
                  : api.updatePatientProfile({ avatar });
                update.then(() => {
                  const userInfo = { ...this.data.userInfo, avatar };
                  app.setUserInfo(userInfo, app.globalData.token, role);
                  this.setData({ userInfo });
                  wx.showToast({ title: '头像已更新', icon: 'success' });
                }).catch(() => {
                  wx.showToast({ title: '更新失败', icon: 'none' });
                });
              }
            }).catch(() => {});
          }
        });
      }
    });
  },

  onOrderTap() {
    wx.switchTab({ url: '/pages/order/list/list' });
  },

  onMyOrders() {
    wx.switchTab({ url: '/pages/order/list/list' });
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
