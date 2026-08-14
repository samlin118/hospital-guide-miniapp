const api = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    order: {}
  },

  onLoad(options) {
    const orderId = options.orderId;
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
        this.setData({ order });
      } else {
        util.showError(res.message || '获取订单失败');
      }
    }).catch(() => {
      util.hideLoading();
      util.showError('网络错误');
    });
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