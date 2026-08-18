const api = require('../../../utils/api');
const util = require('../../../utils/util');
const app = getApp();

Page({
  data: {
    tabs: ['全部', '待支付', '进行中', '已完成'],
    currentTab: 0,
    orders: []
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  loadOrders() {
    util.showLoading();
    const isGuide = app.globalData.role === 'guide';
    const apiCall = isGuide ? api.getGuideOrders() : api.getMyOrders();
    apiCall.then(res => {
      util.hideLoading();
      if (res.code === 200 && res.data) {
        const rows = res.data.rows || res.data.list || (Array.isArray(res.data) ? res.data : []);
        const orders = rows.map(item => {
          const statusInfo = util.getOrderStatusText(item.status);
          return {
            ...item,
            statusText: statusInfo.text,
            statusColor: statusInfo.color,
            peerLabel: isGuide ? '患者' : '导诊员',
            peerName: isGuide ? (item.patient_name || '未知') : (item.guide_name || '未知')
          };
        });
        this.setData({ orders });
        this.filterOrders();
      }
    }).catch(() => {
      util.hideLoading();
    });
  },

  filterOrders() {
    const { currentTab, orders: allOrders } = this.data;
    let orders = allOrders;
    if (currentTab === 1) {
      orders = allOrders.filter(o => o.status === 0);
    } else if (currentTab === 2) {
      orders = allOrders.filter(o => o.status === 1 || o.status === 2);
    } else if (currentTab === 3) {
      orders = allOrders.filter(o => o.status === 3);
    }
    this.setData({ orders: currentTab === 0 ? allOrders : orders });
  },

  onTabChange(e) {
    const currentTab = parseInt(e.currentTarget.dataset.index, 10);
    this.setData({ currentTab });
    this.filterOrders();
  },

  onOrderTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order/detail/detail?orderId=${id}` });
  },

  onPay(e) {
    const id = e.currentTarget.dataset.id;
    const order = this.data.orders.find(o => o.id === id);
    if (order) {
      wx.navigateTo({
        url: `/pages/payment/payment?orderId=${id}&amount=${order.final_amount}&orderNo=${order.order_no}`
      });
    }
  },

  onCancel(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          util.showLoading();
          api.cancelOrder({ order_id: id }).then(res => {
            util.hideLoading();
            if (res.code === 200) {
              util.showSuccess('订单已取消');
              this.loadOrders();
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

  onRate(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/rating/rating?orderId=${id}` });
  }
});