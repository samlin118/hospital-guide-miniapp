const api = require('../../utils/api');
const util = require('../../utils/util');
const { payByWechat, payByAlipay } = require('../../utils/payment');

Page({
  data: {
    orderId: '',
    orderNo: '',
    amount: 0,
    method: 'wechat'
  },

  onLoad(options) {
    const orderId = options.orderId || '';
    const orderNo = options.orderNo || '';
    const amount = parseFloat(options.amount || 0);
    this.setData({ orderId, orderNo, amount });
  },

  onSelectMethod(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ method });
  },

  onPay() {
    const { orderId, amount, method } = this.data;
    if (!orderId) {
      util.showError('订单信息缺失');
      return;
    }

    util.showLoading('支付中...');
    const payFn = method === 'wechat' ? payByWechat : payByAlipay;
    payFn(orderId).then(success => {
      util.hideLoading();
      if (success) {
        util.showSuccess('支付成功');
        // 通知后端：订单完成支付 → 已完成(3)
        const { orderNo } = this.data;
        api.notifyPayment({ order_no: orderNo, method, trade_no: '', status: 'success' }).catch(() => {});
        wx.redirectTo({ url: `/pages/order/detail/detail?orderId=${orderId}` });
      }
    }).catch(err => {
      util.hideLoading();
      util.showError(err.message || '支付失败');
    });
  }
});