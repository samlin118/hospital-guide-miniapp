const api = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    hospitalId: '',
    departmentId: '',
    hospitalName: '',
    departmentName: '',
    patients: []
  },

  onLoad(options) {
    this.setData({
      hospitalId: parseInt(options.hospitalId, 10),
      departmentId: parseInt(options.departmentId, 10),
      hospitalName: decodeURIComponent(options.hospitalName || ''),
      departmentName: decodeURIComponent(options.departmentName || '')
    })
    this.fetchPatients()
  },

  fetchPatients() {
    const { hospitalId, departmentId } = this.data
    api.getDeptPatients({ hospitalId, departmentId, size: 100 }).then(res => {
      if (res.code === 200 && res.data) {
        const rows = res.data.rows || []
        const patients = rows.map(p => ({
          ...p,
          timeText: p.last_order_at ? util.formatTime(p.last_order_at) : ''
        }))
        this.setData({ patients })
      }
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  onPatientTap(e) {
    const id = e.currentTarget.dataset.id
    const p = this.data.patients.find(x => x.id === id)
    if (!p) return
    wx.showModal({
      title: '患者信息',
      content: `姓名：${p.name}\n电话：${p.phone}\n地址：${p.address || '未填写'}\n订单数：${p.order_count} 单`,
      showCancel: false,
      confirmText: '知道了'
    })
  }
})
