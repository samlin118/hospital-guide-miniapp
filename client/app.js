App({
  globalData: {
    userInfo: null,
    token: '',
    role: '', // patient / guide / admin
    serverUrl: 'http://localhost:3000/api'
  },

  onLaunch() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    const role = wx.getStorageSync('role');
    if (token) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.role = role;
    }
  },

  setUserInfo(userInfo, token, role) {
    this.globalData.userInfo = userInfo;
    this.globalData.token = token;
    this.globalData.role = role;
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('token', token);
    wx.setStorageSync('role', role);
  },

  logout() {
    this.globalData.userInfo = null;
    this.globalData.token = '';
    this.globalData.role = '';
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    wx.removeStorageSync('role');
  },

  getUserId() {
    return this.globalData.userInfo?.id;
  },

  isLoggedIn() {
    return !!this.globalData.token;
  },

  showToast(title, icon = 'none') {
    wx.showToast({ title, icon, duration: 2000 });
  }
});
