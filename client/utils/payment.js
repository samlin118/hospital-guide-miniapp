const api = require('./api');

function payByWechat(orderId) {
  return new Promise((resolve, reject) => {
    api.createPayment({ order_id: orderId, method: 'wechat' }).then(res => {
      if (res.code === 200 && res.data) {
        const payData = res.data;
        wx.requestPayment({
          timeStamp: payData.timeStamp || String(Date.now()),
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: 'MD5',
          paySign: payData.paySign,
          success: () => resolve(true),
          fail: (err) => {
            if (err.errMsg.includes('cancel')) {
              reject(new Error('用户取消支付'));
            } else {
              reject(new Error('支付失败'));
            }
          }
        });
      } else {
        reject(new Error(res.message || '创建支付失败'));
      }
    }).catch(err => reject(err));
  });
}

function payByAlipay(orderId) {
  return new Promise((resolve, reject) => {
    api.createPayment({ order_id: orderId, method: 'alipay' }).then(res => {
      if (res.code === 200 && res.data) {
        const payUrl = res.data.payUrl;
        wx.showModal({
          title: '支付宝支付',
          content: '请复制以下链接到浏览器打开完成支付',
          confirmText: '复制链接',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.setClipboardData({
                data: payUrl,
                success: () => {
                  wx.showToast({ title: '链接已复制', icon: 'success' });
                  resolve(true);
                }
              });
            }
          }
        });
      } else {
        reject(new Error(res.message || '创建支付失败'));
      }
    }).catch(err => reject(err));
  });
}

module.exports = { payByWechat, payByAlipay };
