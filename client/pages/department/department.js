const mock = require('../../utils/mock')

Page({
  data: {
    hospital: {},
    departments: [],
  },

  onLoad(options) {
    const hospitalId = parseInt(options.hospital_id, 10)
    const hospitals = mock.getHospitals()
    const hospital = hospitals.find(h => h.id === hospitalId) || {}
    const allDepts = mock.getDepartments()
    const departments = allDepts.filter(d => d.hospital_id === hospitalId)
    this.setData({ hospital, departments })
  },

  onDeptTap(e) {
    const { id, name } = e.currentTarget.dataset
    const hospitalId = this.data.hospital.id
    wx.navigateTo({
      url: `/pages/guide/list/list?hospitalId=${hospitalId}&departmentId=${id}&departmentName=${encodeURIComponent(name)}`,
    })
  },
})