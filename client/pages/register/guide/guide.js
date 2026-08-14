const api = require('../../../utils/api')

Page({
  data: {
    name: '',
    phone: '',
    idCard: '',
    address: '',
    password: '',
    avatar: '',
    avatarPreview: ''
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },

  onChooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: (res) => {
        const filePath = res.tempFiles[0].tempFilePath
        this.setData({ avatarPreview: filePath })
        wx.getFileSystemManager().readFile({
          filePath,
          encoding: 'base64',
          success: (r) => {
            const ext = ((filePath.split('.').pop()) || 'png').toLowerCase()
            api.uploadAvatar({ base64: r.data, ext }).then((res2) => {
              if (res2.code === 200 && res2.data) {
                const origin = (getApp().globalData.serverUrl || '').replace(/\/api$/, '')
                this.setData({ avatar: origin + res2.data.url })
              }
            }).catch(() => {})
          }
        })
      }
    })
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
    if (!address) {
      wx.showToast({ title: '请输入家庭住址', icon: 'none' })
      return
    }
    if (!password || password.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' })
      return
    }

    api.guideRegister({ name, phone, id_card: idCard, address, password, avatar: this.data.avatar }).then(() => {
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
