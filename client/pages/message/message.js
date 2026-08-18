const app = getApp()
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    messages: [],
    inputText: ''
  },

  onLoad() {
    this.loadMessages()
  },

  loadMessages() {
    api.getMyMessages().then(res => {
      if (res.code === 200 && res.data) {
        const rows = res.data.rows || res.data.list || (Array.isArray(res.data) ? res.data : [])
        const messages = rows.map(m => ({
          ...m,
          timeText: m.created_at ? util.formatTime(m.created_at) : ''
        }))
        this.setData({ messages })
      } else {
        this.setData({ messages: [] })
      }
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
    api.createMessage({ content }).then(() => {
      this.setData({ inputText: '' })
      wx.showToast({ title: '已发送', icon: 'success' })
      this.loadMessages()
    }).catch(() => {
      wx.showToast({ title: '发送失败，请重试', icon: 'none' })
    })
  }
})
