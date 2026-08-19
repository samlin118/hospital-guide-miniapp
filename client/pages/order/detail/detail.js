const api = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    order: {},
    isGuide: false
  },

  onLoad(options) {
    const orderId = options.orderId;
    this.setData({ isGuide: getApp().globalData.role === 'guide' });
    if (!orderId) {
      util.showError('订单ID缺失');
      return;
    }
    this.loadOrder(orderId);
  },

  loadOrder(orderId) {
    util.showLoading();
    api.getOrderDetail(orderId).then(res => {
      util.hideLoading();
      if (res.code === 200 && res.data) {
        const order = res.data;
        const statusInfo = util.getOrderStatusText(order.status);
        const statusIcons = { 0: '⏳', 1: '✅', 2: '🚶', 3: '✔️', 4: '❌' };
        order.statusText = statusInfo.text;
        order.statusColor = statusInfo.color;
        order.statusIcon = statusIcons[order.status] || '';
        // 订单金额 = 收费 - 折扣（待导诊订单显示）
        order.orderAmount = (Number(order.base_amount) - Number(order.discount_amount || 0)).toFixed(2);
        this.setData({ order });
      } else {
        util.showError(res.message || '获取订单失败');
      }
    }).catch(() => {
      util.hideLoading();
      util.showError('网络错误');
    });
  },

  // 导诊员接订单：待导诊(0) → 进行中(2)，并关联订单与导诊员
  onAcceptOrder() {
    const order = this.data.order;
    wx.showModal({
      title: '提示',
      content: '确认接单并开始服务吗？',
      success: (res) => {
        if (res.confirm) {
          util.showLoading();
          api.startOrder({ order_id: order.id }).then(res => {
            util.hideLoading();
            if (res.code === 200) {
              util.showSuccess('已接单');
              this.loadOrder(order.id);
            } else {
              util.showError(res.message || '操作失败');
            }
          }).catch(() => {
            util.hideLoading();
            util.showError('网络错误');
          });
        }
      }
    });
  },

  // 后退
  onBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.switchTab({ url: '/pages/order/list/list' });
    }
  },

  onCancel() {
    const order = this.data.order;
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          util.showLoading();
          api.cancelOrder({ order_id: order.id }).then(res => {
            util.hideLoading();
            if (res.code === 200) {
              util.showSuccess('订单已取消');
              this.loadOrder(order.id);
            } else {
              util.showError(res.message || '取消失败');
            }
          }).catch(() => {
            util.hideLoading();
            util.showError('网络错误');
          });
        }
      }
    });
  },

  onPay() {
    const order = this.data.order;
    wx.navigateTo({
      url: `/pages/payment/payment?orderId=${order.id}&amount=${order.final_amount}&orderNo=${order.order_no}`
    });
  }
});