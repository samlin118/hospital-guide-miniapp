const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    role: '',
    phone: '',
    password: ''
  },

  selectRole(e) {
    this.setData({ role: e.currentTarget.dataset.role })
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  onLogin() {
    const { role, phone, password } = this.data
    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    const loginApi = role === 'patient' ? api.patientLogin : api.guideLogin
    loginApi({ phone, password }).then(res => {
      app.setUserInfo(res.data)
      wx.switchTab({ url: '/pages/index/index' })
    }).catch(err => {
      wx.showToast({ title: err.message || '登录失败', icon: 'none' })
    })
  },

  onRegister() {
    const { role } = this.data
    if (!role) {
      wx.showToast({ title: '请先选择身份角色', icon: 'none' })
      return
    }
    const url = role === 'patient'
      ? '/pages/register/patient/patient'
      : '/pages/register/guide/guide'
    wx.navigateTo({ url })
  },

  onAdminLogin() {
    wx.showModal({
      title: '管理员登录',
      content: '管理员请使用专用入口登录',
      showCancel: false
    })
  }
})
