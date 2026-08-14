const api = require('../../utils/api')

Page({
  data: {
    keyword: '',
    filterLevel: '',
    allHospitals: [],
    hospitals: [],
  },

  onLoad() {
    this.fetchHospitals()
  },

  fetchHospitals() {
    api.getHospitalList({ size: 100 }).then(res => {
      if (res.code === 200 && res.data) {
        const allHospitals = res.data.rows || []
        this.setData({ allHospitals })
        this.filterHospitals()
      }
    }).catch(() => {})
  },

  filterHospitals() {
    const { keyword, filterLevel, allHospitals } = this.data
    let list = [...allHospitals]
    if (keyword) {
      list = list.filter(h => h.name && h.name.includes(keyword))
    }
    if (filterLevel) {
      list = list.filter(h => h.level === filterLevel)
    }
    this.setData({ hospitals: list })
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    this.filterHospitals()
  },

  onFilterLevel(e) {
    const level = e.currentTarget.dataset.level
    this.setData({ filterLevel: level })
    this.filterHospitals()
  },

  onHospitalTap(e) {
    const id = e.currentTarget.id || (e.detail && e.detail.id)
    wx.navigateTo({ url: `/pages/department/department?hospital_id=${id}` })
  },
})