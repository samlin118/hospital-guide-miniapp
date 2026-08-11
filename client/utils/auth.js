const app = getApp();

function checkLogin() {
  if (!app.isLoggedIn()) {
    wx.navigateTo({ url: '/pages/login/login' });
    return false;
  }
  return true;
}

function requireAuth() {
  const token = app.globalData.token;
  if (!token) {
    wx.reLaunch({ url: '/pages/login/login' });
    return false;
  }
  return true;
}

function getRole() {
  return app.globalData.role;
}

function isPatient() {
  return app.globalData.role === 'patient';
}

function isGuide() {
  return app.globalData.role === 'guide';
}

function isAdmin() {
  return app.globalData.role === 'admin';
}

module.exports = {
  checkLogin,
  requireAuth,
  getRole,
  isPatient,
  isGuide,
  isAdmin
};
