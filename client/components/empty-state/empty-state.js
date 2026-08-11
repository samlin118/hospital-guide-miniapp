Component({
  properties: {
    text: {
      type: String,
      value: '暂无数据'
    },
    image: {
      type: String,
      value: ''
    },
    showBtn: {
      type: Boolean,
      value: false
    },
    btnText: {
      type: String,
      value: '重新加载'
    }
  },
  methods: {
    onBtnTap() {
      this.triggerEvent('action')
    }
  }
})
