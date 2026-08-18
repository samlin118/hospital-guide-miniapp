const api = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    messages: [],
    page: 1,
    total: 0,
    hasMore: true
  },

  onLoad() {
    this.loadMessages(true);
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.loadMessages();
    }
  },

  loadMessages(reset = false) {
    const page = reset ? 1 : this.data.page;
    api.adminGetMessages({ page, size: 20 }).then(res => {
      if (res.code === 200 && res.data) {
        const rows = res.data.rows || [];
        const messages = rows.map(m => ({
          ...m,
          timeText: m.created_at ? util.formatTime(m.created_at) : '',
          roleText: m.role === 'guide' ? '导诊员' : '患者',
          repliedText: m.replied ? '已回复' : '未回复'
        }));
        const list = reset ? messages : [...this.data.messages, ...messages];
        this.setData({
          messages: list,
          total: res.data.total || 0,
          page: page + 1,
          hasMore: list.length < (res.data.total || 0)
        });
      }
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  onReply(e) {
    const id = Number(e.currentTarget.dataset.id);
    const msg = this.data.messages.find(m => m.id === id);
    if (!msg) return;
    wx.showModal({
      title: '回复留言',
      editable: true,
      placeholderText: '请输入回复内容',
      content: msg.reply || '',
      success: (r) => {
        if (r.confirm) {
          const reply = (r.content || '').trim();
          if (!reply) {
            wx.showToast({ title: '回复内容不能为空', icon: 'none' });
            return;
          }
          api.adminReplyMessage(id, { reply }).then(() => {
            wx.showToast({ title: '回复成功', icon: 'success' });
            this.loadMessages(true);
          }).catch(() => {
            wx.showToast({ title: '回复失败', icon: 'none' });
          });
        }
      }
    });
  }
});
