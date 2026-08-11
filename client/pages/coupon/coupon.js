const api = require('../../utils/api');
const util = require('../../utils/util');
const app = getApp();

Page({
  data: {
    coupons: []
  },

  onLoad() {
    api.getMyCoupons().then(res => {
      if (res.data) {
        this.setData({ coupons: res.data });
      }
    }).catch(() => {});
  }
});
