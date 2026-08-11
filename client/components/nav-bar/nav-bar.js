Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    showBack: {
      type: Boolean,
      value: true
    }
  },
  data: {
    statusBarHeight: 20,
    navHeight: 64
  },
  lifetimes: {
    attached() {
      const sysInfo = wx.getSystemInfoSync()
      const statusBarHeight = sysInfo.statusBarHeight || 20
      this.setData({
        statusBarHeight,
        navHeight: statusBarHeight + 44
      })
    }
  },
  methods: {
    onBack() {
      wx.navigateBack()
    }
  }
})
