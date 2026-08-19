const api = require('../../../utils/api')

Page({
  data: {
    guide: {},
    ratings: [],
  },

  onLoad(options) {
    const guideId = parseInt(options.guideId, 10)
    api.getGuideDetail(guideId).then(res => {
      if (res.code === 200 && res.data) {
        const { ratings, ...guide } = res.data
        this.setData({ guide, ratings: ratings || [] })
      }
    }).catch(() => {})
  },

  onBook() {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    const guideId = this.data.guide.id
    const price = this.data.guide.price || 50
    wx.navigateTo({ url: `/pages/order/confirm/confirm?guideId=${guideId}&price=${price}` })
  },
})