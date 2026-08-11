const { CONFIG } = require('./config');

function formatTime(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = padZero(d.getMonth() + 1);
  const day = padZero(d.getDate());
  const hour = padZero(d.getHours());
  const minute = padZero(d.getMinutes());
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = padZero(d.getMonth() + 1);
  const day = padZero(d.getDate());
  return `${year}-${month}-${day}`;
}

function padZero(num) {
  return num < 10 ? '0' + num : String(num);
}

function calculateAmount(duration) {
  if (duration <= CONFIG.PRICING.BASE_HOURS) {
    return CONFIG.PRICING.BASE_PRICE;
  }
  return CONFIG.PRICING.BASE_PRICE + (duration - CONFIG.PRICING.BASE_HOURS) * CONFIG.PRICING.HOURLY_RATE;
}

function getOrderStatusText(status) {
  const map = CONFIG.ORDER_STATUS;
  return map[status] || { text: '未知', color: '#999' };
}

function showError(msg) {
  wx.showToast({ title: msg || '操作失败', icon: 'none', duration: 2000 });
}

function showSuccess(msg) {
  wx.showToast({ title: msg || '操作成功', icon: 'success', duration: 2000 });
}

function showLoading(msg = '加载中...') {
  wx.showLoading({ title: msg, mask: true });
}

function hideLoading() {
  wx.hideLoading();
}

function navigateTo(url) {
  wx.navigateTo({ url });
}

function switchTab(url) {
  wx.switchTab({ url });
}

function reLaunch(url) {
  wx.reLaunch({ url });
}

module.exports = {
  formatTime,
  formatDate,
  calculateAmount,
  getOrderStatusText,
  showError,
  showSuccess,
  showLoading,
  hideLoading,
  navigateTo,
  switchTab,
  reLaunch
};
