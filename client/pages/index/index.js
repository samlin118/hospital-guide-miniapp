const mock = require('../../utils/mock')

Page({
  data: {
    banners: [],
    quickNavs: [
      { id: 1, name: '找医院', icon: '/images/icons/hospital.png', url: '/pages/hospital/hospital' },
      { id: 2, name: '找导诊', icon: '/images/icons/guide.png', url: '/pages/guide/list/list' },
      { id: 3, name: '我的订单', icon: '/images/icons/order.png', url: '/pages/order/order' },
      { id: 4, name: '个人中心', icon: '/images/icons/mine.png', url: '/pages/mine/mine' },
    ],
    hospitals: [],
    guides: [],
  },

  onLoad() {
    const banners = mock.getBanners()
    const hospitals = mock.getHospitals()
    const guides = mock.getGuides()
    this.setData({ banners, hospitals, guides })
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