const api = require('../../../utils/api');
const util = require('../../../utils/util');
const app = getApp();

Page({
  data: {
    form: { name: '', discount: '', min_amount: '', total_count: '', expire_days: '30' },
    coupons: []
  },

  onLoad() {
    this.loadCoupons();
  },

  loadCoupons() {
    api.adminGetCoupons().then(res => {
      if (res.data) {
        this.setData({ coupons: res.data });
      }
    }).catch(() => {});
  },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({ [`form.${field}`]: value });
  },

  onCreate() {
    const { form } = this.data;
    if (!form.name || !form.discount) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    api.adminCreateCoupon({
      name: form.name,
      discount: parseFloat(form.discount),
      min_amount: parseFloat(form.min_amount) || 0,
      total_count: parseInt(form.total_count) || 0,
      expire_days: parseInt(form.expire_days) || 30
    }).then(res => {
      wx.showToast({ title: '创建成功', icon: 'success' });
      this.setData({ form: { name: '', discount: '', min_amount: '', total_count: '', expire_days: '30' } });
      this.loadCoupons();
    }).catch(() => {
      wx.showToast({ title: '创建失败', icon: 'none' });
    });
  }
});
