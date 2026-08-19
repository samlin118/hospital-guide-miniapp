const api = require('../../utils/api')
const { CONFIG } = require('../../utils/config')
const app = getApp()

Page({
  data: {
    banners: [
      { id: 1, image: '', url: '', title: '新用户专享优惠券' },
      { id: 2, image: '', url: '', title: '金牌导诊员限时特惠' },
      { id: 3, image: '', url: '', title: '三甲医院导诊服务' }
    ],
    quickNavs: [],
    role: '',
    hospitals: [],
    guides: [],
    patientOrders: [],
  },

  onLoad() {
    if (app.isLoggedIn()) {
      this.initRole()
      this.fetchHomeData()
    }
  },

  onShow() {
    if (!app.isLoggedIn()) {
      wx.reLaunch({ url: '/pages/login/login' })
    } else {
      this.initRole()
    }
  },

  initRole() {
    const role = app.globalData.role || ''
    const isGuide = role === 'guide'
    this.setData({ role })
    this.setData({
      quickNavs: [
        { id: 1, name: '找医院', icon: '/images/icons/hospital.png', url: '/pages/hospital/hospital', bg: 'nav-bg-hospital' },
        isGuide
          ? { id: 2, name: '我的患者', icon: '/images/icons/patient.png', url: '/pages/order/list/list', bg: 'nav-bg-guide' }
          : { id: 2, name: '找导诊', icon: '/images/icons/guide.png', url: '/pages/guide/list/list', bg: 'nav-bg-guide' },
        { id: 3, name: '我的订单', icon: '/images/icons/order.png', url: '/pages/order/list/list', bg: 'nav-bg-order' },
        { id: 4, name: '个人中心', icon: '/images/icons/mine.png', url: '/pages/profile/profile', bg: 'nav-bg-mine' },
      ]
    })
  },

  fetchHomeData() {
    const price = CONFIG.PRICING.BASE_PRICE
    api.getHospitalList({ size: 50 }).then(res => {
      if (res.code === 200 && res.data) {
        this.setData({ hospitals: res.data.rows || [] })
      }
    }).catch(() => {})

    // 导诊员看患者的导诊订单（待导诊 = 待支付0 的订单，支付后变已完成不再显示），患者看推荐导诊员
    if (app.globalData.role === 'guide') {
      api.getGuideOrders({ size: 50 }).then(res => {
        if (res.code === 200 && res.data) {
          const rows = (res.data.rows || []).filter(o => o.status === 0)
          const orders = rows.map(o => ({
            ...o,
            statusText: '待导诊',
            statusColor: '#FF976A'
          }))
          this.setData({ patientOrders: orders })
        }
      }).catch(() => {})
    } else {
      api.getGuideList({ size: 50 }).then(res => {
        if (res.code === 200 && res.data) {
          const guides = (res.data.rows || []).map(g => ({ ...g, price: g.price || price }))
          this.setData({ guides })
        }
      }).catch(() => {})
    }
  },

  onSearch() {
    wx.navigateTo({ url: '/pages/hospital/hospital' })
  },

  onNavTap(e) {
    const url = e.currentTarget.dataset.url
    if (url.indexOf('/pages/order/list/list') !== -1 || url.indexOf('/pages/profile/profile') !== -1) {
      wx.switchTab({ url })
    } else {
      wx.navigateTo({ url })
    }
  },

  onMoreHospital() {
    wx.navigateTo({ url: '/pages/hospital/hospital' })
  },

  onMoreGuide() {
    if (app.globalData.role === 'guide') {
      wx.switchTab({ url: '/pages/order/list/list' })
    } else {
      wx.navigateTo({ url: '/pages/guide/list/list' })
    }
  },

  onHospitalTap(e) {
    const id = e.currentTarget.id || (e.detail && e.detail.id)
    wx.navigateTo({ url: `/pages/department/department?hospital_id=${id}` })
  },

  onGuideTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/guide/detail/detail?guideId=${id}` })
  },

  onPatientTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/order/detail/detail?orderId=${id}` })
  },
})