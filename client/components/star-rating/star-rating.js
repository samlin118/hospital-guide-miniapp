Component({
  properties: {
    value: {
      type: Number,
      value: 5
    },
    max: {
      type: Number,
      value: 5
    },
    interactive: {
      type: Boolean,
      value: false
    },
    showText: {
      type: Boolean,
      value: false
    },
    size: {
      type: Number,
      value: 32
    }
  },
  data: {
    halfValue: 0
  },
  methods: {
    onStarTap(e) {
      if (!this.properties.interactive) return
      const value = e.currentTarget.dataset.index
      this.setData({ value })
      this.triggerEvent('change', { value })
    }
  }
})
