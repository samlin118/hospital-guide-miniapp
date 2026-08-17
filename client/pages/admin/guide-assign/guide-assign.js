const api = require('../../../utils/api');

Page({
  data: {
    guides: [],
    guideIndex: 0,
    selectedGuide: null,
    hospitals: [],
    hospitalIndex: 0,
    selectedHospital: null,
    departments: [],
    checkedDepts: {},
    currentAssignments: []
  },

  onLoad() {
    Promise.all([
      api.adminGetGuides({ size: 100 }),
      api.getHospitalList({ size: 100 })
    ]).then(([gRes, hRes]) => {
      const guides = (gRes.data && gRes.data.rows) || [];
      const hospitals = (hRes.data && (hRes.data.rows || hRes.data)) || [];
      this.setData({ guides, hospitals });
      if (guides.length) {
        this.onGuideChange({ detail: { value: 0 } });
      }
      if (hospitals.length) {
        this.onHospitalChange({ detail: { value: 0 } });
      }
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  onGuideChange(e) {
    const guideIndex = Number(e.detail.value);
    const selectedGuide = this.data.guides[guideIndex] || null;
    this.setData({ guideIndex, selectedGuide, checkedDepts: {} });
    if (selectedGuide) {
      api.getGuideAssignments(selectedGuide.id).then(res => {
        const currentAssignments = (res.data || []).map(a => ({
          ...a,
          key: a.hospital_id + '-' + a.department_id
        }));
        this.setData({ currentAssignments });
      }).catch(() => {});
    } else {
      this.setData({ currentAssignments: [] });
    }
  },

  onHospitalChange(e) {
    const hospitalIndex = Number(e.detail.value);
    const selectedHospital = this.data.hospitals[hospitalIndex] || null;
    this.setData({ hospitalIndex, selectedHospital, checkedDepts: {}, departments: [] });
    if (selectedHospital) {
      api.getHospitalDetail(selectedHospital.id).then(res => {
        this.setData({ departments: (res.data && res.data.departments) || [] });
      }).catch(() => {});
    }
  },

  onDeptToggle(e) {
    const id = Number(e.currentTarget.dataset.id);
    this.setData({ [`checkedDepts.${id}`]: !this.data.checkedDepts[id] });
  },

  onSave() {
    const { selectedGuide, selectedHospital, checkedDepts } = this.data;
    if (!selectedGuide) {
      wx.showToast({ title: '请先选择导诊员', icon: 'none' });
      return;
    }
    if (!selectedHospital) {
      wx.showToast({ title: '请先选择医院', icon: 'none' });
      return;
    }
    const assignments = Object.keys(checkedDepts)
      .filter(k => checkedDepts[k])
      .map(k => ({ hospital_id: selectedHospital.id, department_id: Number(k) }));
    if (!assignments.length) {
      wx.showModal({
        title: '提示',
        content: '未选择任何科室。保存后将清空该导诊员在本医院的全部科室分配，确定吗？',
        success: (r) => { if (r.confirm) this.doAssign(assignments); }
      });
      return;
    }
    this.doAssign(assignments);
  },

  doAssign(assignments) {
    const guideId = this.data.selectedGuide.id;
    api.assignGuideDepartments({ guide_id: guideId, assignments }).then(res => {
      wx.showToast({ title: '保存成功', icon: 'success' });
      const currentAssignments = (res.data || []).map(a => ({
        ...a,
        key: a.hospital_id + '-' + a.department_id
      }));
      this.setData({ currentAssignments, checkedDepts: {} });
    }).catch(() => {
      wx.showToast({ title: '保存失败', icon: 'none' });
    });
  }
});
