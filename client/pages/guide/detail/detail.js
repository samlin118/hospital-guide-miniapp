const mock = require('../../../utils/mock')

Page({
  data: {
    guide: {},
    ratings: [],
  },

  onLoad(options) {
    const guideId = parseInt(options.guideId, 10)
    const allGuides = mock.getGuides()
    const guide = allGuides.find(g => g.id === guideId) || {}
    const ratings = mock.getRatings(guideId)
    this.setData({ guide, ratings })
  },

  onBook() {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    const guideId = this.data.guide.id
    wx.navigateTo({ url: `/pages/order/order?guideId=${guideId}` })
  },
})