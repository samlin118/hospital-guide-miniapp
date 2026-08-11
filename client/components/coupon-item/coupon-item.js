Component({
  properties: {
    id: {
      type: [String, Number],
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    discount: {
      type: Number,
      value: 9.0
    },
    minAmount: {
      type: Number,
      value: 0
    },
    expireAt: {
      type: String,
      value: ''
    },
    used: {
      type: Boolean,
      value: false
    }
  },
  data: {
    expireText: ''
  },
  observers: {
    expireAt(val) {
      if (!val) {
        this.setData({ expireText: '' })
        return
      }
      const now = Date.now()
      const expireTime = new Date(val).getTime()
      const diff = expireTime - now
      if (diff <= 0) {
        this.setData({ expireText: '已过期' })
      } else {
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
        this.setData({ expireText: `${days}天后过期` })
      }
    }
  },
  methods: {
    onUse() {
      if (this.properties.used) return
      this.triggerEvent('use', { id: this.properties.id })
    }
  }
})
