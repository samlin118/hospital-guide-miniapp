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
    avatar: {
      type: String,
      value: ''
    },
    score: {
      type: Number,
      value: 0
    },
    serviceCount: {
      type: Number,
      value: 0
    },
    desc: {
      type: String,
      value: ''
    },
    price: {
      type: Number,
      value: 0
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { id: this.properties.id })
    }
  }
})
