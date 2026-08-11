const mock = require('../../../utils/mock')

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
    const allGuides = mock.getGuides()
    let guides = allGuides
    if (hospitalId) {
      guides = guides.filter(g => g.hospital_id === hospitalId)
    }
    if (departmentId) {
      guides = guides.filter(g => g.department_id === departmentId)
    }
    this.setData({ guides, hospitalId, departmentId })
  },

  onSort(e) {
    const sortBy = e.currentTarget.dataset.sort
    const guides = [...this.data.guides]
    if (sortBy === 'score') {
      guides.sort((a, b) => b.score - a.score)
    } else if (sortBy === 'price') {
      guides.sort((a, b) => a.price - b.price)
    } else {
      const allGuides = mock.getGuides()
      const { hospitalId, departmentId } = this.data
      let sorted = allGuides
      if (hospitalId) sorted = sorted.filter(g => g.hospital_id === hospitalId)
      if (departmentId) sorted = sorted.filter(g => g.department_id === departmentId)
      this.setData({ guides: sorted, sortBy })
      return
    }
    this.setData({ guides, sortBy })
  },

  onGuideTap(e) {
    const id = e.currentTarget.id || (e.detail && e.detail.id)
    wx.navigateTo({ url: `/pages/guide/detail/detail?guideId=${id}` })
  },
})