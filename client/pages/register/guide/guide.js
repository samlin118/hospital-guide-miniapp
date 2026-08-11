const api = require('../../utils/api')

Page({
  data: {
    name: '',
    phone: '',
    idCard: '',
    address: '',
    password: ''
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },

  onRegister() {
    const { name, phone, idCard, address, password } = this.data

    if (!name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!/^\d{11}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的11位手机号', icon: 'none' })
      return
    }
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      wx.showToast({ title: '请输入正确的18位身份证号', icon: 'none' })
      return
    }
    if (!address) {
      wx.showToast({ title: '请输入家庭住址', icon: 'none' })
      return
    }
    if (!password || password.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' })
      return
    }

    api.guideRegister({ name, phone, idCard, address, password }).then(() => {
      wx.showToast({ title: '注册成功' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }).catch(err => {
      wx.showToast({ title: err.message || '注册失败', icon: 'none' })
    })
  },

  onToLogin() {
    wx.navigateBack()
  }
})
