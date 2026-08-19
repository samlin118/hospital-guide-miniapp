const api = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    guides: []
  },

  onLoad() {
    this.loadGuides();
  },

  loadGuides() {
    api.adminGetGuides({ size: 100 }).then(res => {
      if (res.code === 200 && res.data) {
        this.setData({ guides: res.data.rows || [] });
      }
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  onEditPrice(e) {
    const id = Number(e.currentTarget.dataset.id);
    const guide = this.data.guides.find(g => g.id === id);
    if (!guide) return;
    wx.showModal({
      title: '修改每小时报价',
      editable: true,
      placeholderText: '请输入每小时报价（元）',
      content: String(guide.price || ''),
      success: (r) => {
        if (r.confirm) {
          const price = parseFloat(r.content);
          if (isNaN(price) || price <= 0) {
            wx.showToast({ title: '请输入有效的报价', icon: 'none' });
            return;
          }
          api.adminUpdateGuide({ id, price }).then(() => {
            wx.showToast({ title: '修改成功', icon: 'success' });
            this.loadGuides();
          }).catch(() => {
            wx.showToast({ title: '修改失败', icon: 'none' });
          });
        }
      }
    });
  }
});
