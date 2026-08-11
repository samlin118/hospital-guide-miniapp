const mock = require('../../utils/mock')

Page({
  data: {
    keyword: '',
    filterLevel: '',
    allHospitals: [],
    hospitals: [],
  },

  onLoad() {
    const hospitals = mock.getHospitals()
    this.setData({ allHospitals: hospitals, hospitals })
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    const { keyword, filterLevel, allHospitals } = this.data
    let list = [...allHospitals]
    if (keyword) {
      list = list.filter(h => h.name.includes(keyword))
    }
    if (filterLevel) {
      list = list.filter(h => h.level === filterLevel)
    }
    this.setData({ hospitals: list })
  },

  onFilterLevel(e) {
    const level = e.currentTarget.dataset.level
    const { keyword, allHospitals } = this.data
    this.setData({ filterLevel: level })
    let list = [...allHospitals]
    if (keyword) {
      list = list.filter(h => h.name.includes(keyword))
    }
    if (level) {
      list = list.filter(h => h.level === level)
    }
    this.setData({ hospitals: list })
  },

  onHospitalTap(e) {
    const id = e.currentTarget.id || (e.detail && e.detail.id)
    wx.navigateTo({ url: `/pages/department/department?hospital_id=${id}` })
  },
})