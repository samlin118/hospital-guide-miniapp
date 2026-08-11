const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    messages: [],
    inputText: ''
  },

  onLoad() {
    api.getMyMessages().then(res => {
      this.setData({ messages: res.data || [] })
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  onSend() {
    if (!this.data.inputText) return
    const content = this.data.inputText
    api.createMessage({ content }).then(res => {
      const newMsg = res.data || { id: Date.now(), content, role: 'patient', created_at: new Date().toLocaleString() }
      this.setData({
        messages: [...this.data.messages, newMsg],
        inputText: ''
      })
    }).catch(() => {
      wx.showToast({ title: '发送失败，请重试', icon: 'none' })
    })
  }
})
