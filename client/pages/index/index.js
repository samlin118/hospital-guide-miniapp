const api = require('../../utils/api')
const { CONFIG } = require('../../utils/config')

Page({
  data: {
    banners: [
      { id: 1, image: '', url: '', title: '新用户专享优惠券' },
      { id: 2, image: '', url: '', title: '金牌导诊员限时特惠' },
      { id: 3, image: '', url: '', title: '三甲医院导诊服务' }
    ],
    quickNavs: [
      { id: 1, name: '找医院', icon: '/images/icons/hospital.png', url: '/pages/hospital/hospital', bg: 'nav-bg-hospital' },
      { id: 2, name: '找导诊', icon: '/images/icons/guide.png', url: '/pages/guide/list/list', bg: 'nav-bg-guide' },
      { id: 3, name: '我的订单', icon: '/images/icons/order.png', url: '/pages/order/list/list', bg: 'nav-bg-order' },
      { id: 4, name: '个人中心', icon: '/images/icons/mine.png', url: '/pages/profile/profile', bg: 'nav-bg-mine' },
    ],
    hospitals: [],
    guides: [],
  },

  onLoad() {
    const price = CONFIG.PRICING.BASE_PRICE
    api.getHospitalList({ size: 50 }).then(res => {
      if (res.code === 200 && res.data) {
        this.setData({ hospitals: res.data.rows || [] })
      }
    }).catch(() => {})

    api.getGuideList({ size: 50 }).then(res => {
      if (res.code === 200 && res.data) {
        const guides = (res.data.rows || []).map(g => ({ ...g, price }))
        this.setData({ guides })
      }
    }).catch(() => {})
  },

  onSearch() {
    wx.navigateTo({ url: '/pages/hospital/hospital' })
  },

  onNavTap(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },

  onMoreHospital() {
    wx.navigateTo({ url: '/pages/hospital/hospital' })
  },

  onMoreGuide() {
    wx.navigateTo({ url: '/pages/guide/list/list' })
  },

  onHospitalTap(e) {
    const id = e.currentTarget.id || (e.detail && e.detail.id)
    wx.navigateTo({ url: `/pages/department/department?hospital_id=${id}` })
  },

  onGuideTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/guide/detail/detail?guideId=${id}` })
  },
})