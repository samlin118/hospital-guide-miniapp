const api = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    hospitalId: '',
    departmentId: '',
    hospitalName: '',
    departmentName: '',
    orders: []
  },

  onLoad(options) {
    this.setData({
      hospitalId: parseInt(options.hospitalId, 10),
      departmentId: parseInt(options.departmentId, 10),
      hospitalName: decodeURIComponent(options.hospitalName || ''),
      departmentName: decodeURIComponent(options.departmentName || '')
    })
    this.fetchOrders()
  },

  fetchOrders() {
    const { hospitalId, departmentId } = this.data
    api.getDeptOrders({ hospitalId, departmentId, size: 100 }).then(res => {
      if (res.code === 200 && res.data) {
        // 只显示「待导诊」状态的订单（待支付0，支付后变已完成不再显示）
        const rows = (res.data.rows || []).filter(o => o.status === 0)
        const orders = rows.map(o => ({
          ...o,
          statusText: '待导诊',
          statusColor: '#FF976A',
          timeText: o.created_at ? util.formatTime(o.created_at) : ''
        }))
        this.setData({ orders })
      }
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  onOrderTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/order/detail/detail?orderId=${id}` })
  }
})
