const api = require('../../utils/api')

// 科室徽章配色（按科室 id 取色，稳定）
const DEPT_COLORS = [
  '#4A90D9', '#07C160', '#E8734A', '#9B59B6', '#E74C3C',
  '#1ABC9C', '#F39C12', '#3498DB', '#2ECC71', '#E67E22',
  '#8E44AD', '#16A085', '#D35400', '#C0392B', '#2980B9',
  '#27AE60', '#F1C40F', '#5DADE2', '#EC7063', '#58D68D'
]

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
        const items = (departments || []).map(d => ({
          ...d,
          deptChar: (d.name || '科').charAt(0),
          deptColor: DEPT_COLORS[Math.abs(d.id) % DEPT_COLORS.length]
        }))
        this.setData({ hospital, departments: items })
      }
    }).catch(() => {})
  },

  onDeptTap(e) {
    const { id, name } = e.currentTarget.dataset
    const hospitalId = this.data.hospital.id
    // 导诊员选择科室 → 看该科室需要服务的患者；患者 → 看该科室的导诊员
    if (getApp().globalData.role === 'guide') {
      wx.navigateTo({
        url: `/pages/guide/patients/patients?hospitalId=${hospitalId}&departmentId=${id}&departmentName=${encodeURIComponent(name)}&hospitalName=${encodeURIComponent(this.data.hospital.name || '')}`,
      })
      return
    }
    wx.navigateTo({
      url: `/pages/guide/list/list?hospitalId=${hospitalId}&departmentId=${id}&departmentName=${encodeURIComponent(name)}`,
    })
  },
})