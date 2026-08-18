const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    role: '',
    phone: '',
    password: '',
    adminMode: false,
    adminName: ''
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

  onAdminNameInput(e) {
    this.setData({ adminName: e.detail.value })
  },

  onAdminLogin() {
    this.setData({ adminMode: true })
  },

  onBackToUserLogin() {
    this.setData({ adminMode: false })
  },

  onLogin() {
    if (this.data.adminMode) {
      this.adminLogin()
      return
    }
    const { role, phone, password } = this.data
    if (!role) {
      wx.showToast({ title: '请先选择身份角色', icon: 'none' })
      return
    }
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
      const data = res.data || {}
      const user = data.patient || data.guide || {}
      app.setUserInfo({ ...user, role }, data.token, role)
      wx.switchTab({ url: '/pages/index/index' })
    }).catch(err => {
      const msg = (err && err.message) || '登录失败'
      if (/尚未注册|not found/i.test(msg)) {
        wx.showModal({
          title: '提示',
          content: `手机号 ${phone} 尚未注册，是否立即注册？`,
          confirmText: '去注册',
          success: (r) => {
            if (r.confirm) {
              const path = role === 'patient' ? 'patient/patient' : 'guide/guide'
              wx.navigateTo({ url: `/pages/register/${path}?phone=${phone}` })
            }
          }
        })
        return
      }
      wx.showToast({ title: msg, icon: 'none' })
    })
  },

  adminLogin() {
    const { adminName, password } = this.data
    if (!adminName) {
      wx.showToast({ title: '请输入管理员账号', icon: 'none' })
      return
    }
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }
    api.adminLogin({ username: adminName, password }).then(res => {
      const data = res.data || {}
      const user = data.admin || {}
      app.setUserInfo({ ...user, role: 'admin' }, data.token, 'admin')
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
  }
})
