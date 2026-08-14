const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    orderId: '',
    guideId: '',
    score: 0,
    content: '',
    anonymous: false,
    scoreText: ''
  },

  onLoad(options) {
    this.setData({
      orderId: options.orderId || '',
      guideId: options.guideId || ''
    })
  },

  onStarTap(e) {
    const score = e.currentTarget.dataset.index
    const scoreTextMap = { 1: '非常不满意', 2: '不满意', 3: '一般', 4: '满意', 5: '非常满意' }
    this.setData({
      score,
      scoreText: scoreTextMap[score] || ''
    })
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  onAnonymousChange(e) {
    this.setData({ anonymous: e.detail.value })
  },

  onSubmit() {
    if (this.data.score === 0) {
      wx.showToast({ title: '请先评分', icon: 'none' })
      return
    }
    api.createRating({
      order_id: this.data.orderId,
      score: this.data.score,
      content: this.data.content,
      anonymous: this.data.anonymous
    }).then(() => {
      wx.showToast({ title: '评价成功' })
      wx.switchTab({ url: '/pages/order/list/list' })
    }).catch(() => {
      wx.showToast({ title: '提交失败，请重试', icon: 'none' })
    })
  }
})
