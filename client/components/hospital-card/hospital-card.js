Component({
  properties: {
    id: {
      type: Number,
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
      type: Number,
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
