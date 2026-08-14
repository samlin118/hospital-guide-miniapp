const api = require('../../utils/api')

Page({
  data: {
    hospital: {},
    departments: [],
  },

  onLoad(options) {
    const hospitalId = parseInt(options.hospital_id, 10)
    api.getHospitalDetail(hospitalId).then(res => {
      if (res.code === 200 && res.data) {
        const { departments, ...hospital } = res.data
        this.setData({ hospital, departments: departments || [] })
      }
    }).catch(() => {})
  },

  onDeptTap(e) {
    const { id, name } = e.currentTarget.dataset
    const hospitalId = this.data.hospital.id
    wx.navigateTo({
      url: `/pages/guide/list/list?hospitalId=${hospitalId}&departmentId=${id}&departmentName=${encodeURIComponent(name)}`,
    })
  },
})