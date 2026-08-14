const api = require('../../../utils/api')
const { CONFIG } = require('../../../utils/config')

Page({
  data: {
    guides: [],
    sortBy: 'default',
    hospitalId: '',
    departmentId: '',
  },

  onLoad(options) {
    const hospitalId = parseInt(options.hospitalId, 10)
    const departmentId = parseInt(options.departmentId, 10)
    this.setData({ hospitalId, departmentId })
    this.fetchGuides()
  },

  fetchGuides() {
    const { hospitalId, departmentId } = this.data
    const price = CONFIG.PRICING.BASE_PRICE
    api.getGuideList({ size: 100 }).then(res => {
      if (res.code === 200 && res.data) {
        let guides = (res.data.rows || []).map(g => ({ ...g, price }))
        if (hospitalId) guides = guides.filter(g => g.hospital_id === hospitalId)
        if (departmentId) guides = guides.filter(g => g.department_id === departmentId)
        this.setData({ guides })
      }
    }).catch(() => {})
  },

  onSort(e) {
    const sortBy = e.currentTarget.dataset.sort
    const guides = [...this.data.guides]
    if (sortBy === 'score') {
      guides.sort((a, b) => b.score - a.score)
    } else if (sortBy === 'price') {
      guides.sort((a, b) => a.price - b.price)
    }
    this.setData({ guides, sortBy })
  },

  onGuideTap(e) {
    const id = e.currentTarget.id || (e.detail && e.detail.id)
    wx.navigateTo({ url: `/pages/guide/detail/detail?guideId=${id}` })
  },
})