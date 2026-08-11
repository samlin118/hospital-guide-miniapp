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
    image: {
      type: String,
      value: ''
    },
    address: {
      type: String,
      value: ''
    },
    level: {
      type: String,
      value: ''
    },
    score: {
      type: [String, Number],
      value: ''
    },
    distance: {
      type: String,
      value: ''
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { id: this.properties.id })
    }
  }
})
