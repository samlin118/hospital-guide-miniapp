const api = require('../../../utils/api');
const util = require('../../../utils/util');
const app = getApp();

Page({
  data: {
    form: { name: '', address: '', phone: '' },
    levels: ['三甲', '二甲', '三乙', '二乙', '社区医院'],
    levelIndex: 0,
    hospitals: [],
    editId: null
  },

  onLoad() {
    this.loadHospitals();
  },

  loadHospitals() {
    api.getHospitalList({}).then(res => {
      if (res.data) {
        this.setData({ hospitals: res.data });
      }
    }).catch(() => {});
  },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({ [`form.${field}`]: value });
  },

  onLevelChange(e) {
    this.setData({ levelIndex: e.detail.value });
  },

  onSubmit() {
    const { form, levels, levelIndex, editId } = this.data;
    if (!form.name) {
      wx.showToast({ title: '请输入医院名称', icon: 'none' });
      return;
    }
    const data = { ...form, level: levels[levelIndex] };
    const apiCall = editId ? api.updateHospital(editId, data) : api.createHospital(data);
    apiCall.then(res => {
      wx.showToast({ title: editId ? '更新成功' : '添加成功', icon: 'success' });
      this.setData({ form: { name: '', address: '', phone: '' }, levelIndex: 0, editId: null });
      this.loadHospitals();
    }).catch(() => {
      wx.showToast({ title: '操作失败', icon: 'none' });
    });
  },

  onEdit(e) {
    const id = e.currentTarget.dataset.id;
    const hospital = this.data.hospitals.find(h => h.id === id);
    if (hospital) {
      const levelIndex = this.data.levels.indexOf(hospital.level);
      this.setData({
        form: { name: hospital.name, address: hospital.address, phone: hospital.phone },
        levelIndex: levelIndex >= 0 ? levelIndex : 0,
        editId: id
      });
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除该医院吗？',
      success: (res) => {
        if (res.confirm) {
          api.deleteHospital(id).then(() => {
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.loadHospitals();
          }).catch(() => {
            wx.showToast({ title: '删除失败', icon: 'none' });
          });
        }
      }
    });
  }
});
