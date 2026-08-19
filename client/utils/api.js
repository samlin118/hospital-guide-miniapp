const app = getApp();

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token;
    const header = { 'Content-Type': 'application/json' };
    if (token) {
      header['Authorization'] = 'Bearer ' + token;
    }

    wx.showNavigationBarLoading();

    wx.request({
      url: app.globalData.serverUrl + url,
      method,
      data,
      header,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          app.logout();
          wx.reLaunch({ url: '/pages/login/login' });
          reject(new Error('登录已过期'));
        } else {
          reject(new Error(res.data?.message || '请求失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络错误'));
      },
      complete: () => {
        wx.hideNavigationBarLoading();
      }
    });
  });
}

module.exports = {
  // 认证
  patientLogin: (data) => request('/auth/login/patient', 'POST', data),
  guideLogin: (data) => request('/auth/login/guide', 'POST', data),
  adminLogin: (data) => request('/auth/login/admin', 'POST', data),
  getProfile: () => request('/auth/profile'),

  // 患者
  patientRegister: (data) => request('/patients/register', 'POST', data),
  updatePatientProfile: (data) => request('/patients/profile', 'POST', data),
  getPatientProfile: () => request('/patients/profile'),
  getMyPatients: () => request('/patients/by-guide'),
  getDeptPatients: (params) => request('/patients/by-hospital-department?' + objToParams(params)),
  getDeptOrders: (params) => request('/orders/by-hospital-department?' + objToParams(params)),

  // 导诊员
  guideRegister: (data) => request('/guides/register', 'POST', data),
  updateGuideProfile: (data) => request('/guides/profile', 'POST', data),
  getGuideProfile: () => request('/guides/profile'),
  getGuideDetail: (guideId) => request('/guides/detail/' + guideId),
  getGuideList: (params) => request('/guides/list?' + objToParams(params)),
  getGuideAssignments: (guideId) => request('/guides/assignments/' + guideId),
  assignGuideDepartments: (data) => request('/guides/assignments', 'POST', data),

  // 医院
  getHospitalList: (params) => request('/hospitals/list?' + objToParams(params)),
  getHospitalDetail: (id) => request('/hospitals/detail/' + id),
  createHospital: (data) => request('/hospitals/create', 'POST', data),
  updateHospital: (data) => request('/hospitals/update', 'POST', data),
  deleteHospital: (data) => request('/hospitals/delete', 'POST', data),

  // 订单
  createOrder: (data) => request('/orders/create', 'POST', data),
  getMyOrders: (params) => request('/orders/my?' + objToParams(params)),
  getGuideOrders: (params) => request('/orders/guide?' + objToParams(params)),
  getOrderDetail: (id) => request('/orders/detail/' + id),
  cancelOrder: (data) => request('/orders/cancel', 'POST', data),
  completeOrder: (data) => request('/orders/complete', 'POST', data),

  // 支付
  createPayment: (data) => request('/payments/create', 'POST', data),
  queryPayment: (params) => request('/payments/query?' + objToParams(params)),

  // 评价
  createRating: (data) => request('/ratings/create', 'POST', data),
  getGuideRatings: (guideId, params) => request('/ratings/guide/' + guideId + '?' + objToParams(params)),
  checkRating: (params) => request('/ratings/check?' + objToParams(params)),

  // 留言
  createMessage: (data) => request('/messages/create', 'POST', data),
  getMyMessages: (params) => request('/messages/my?' + objToParams(params)),

  // 优惠券
  getMyCoupons: () => request('/coupons/my'),
  getCouponList: () => request('/coupons/list'),

  // 上传
  uploadAvatar: (data) => request('/upload/avatar', 'POST', data),

  // 管理员
  adminDashboard: () => request('/admin/dashboard'),
  adminStatistics: (params) => request('/admin/statistics?' + objToParams(params)),
  adminGetOrders: (params) => request('/orders/admin/list?' + objToParams(params)),
  adminGetPatients: (params) => request('/patients/list?' + objToParams(params)),
  adminGetGuides: (params) => request('/guides/admin/list?' + objToParams(params)),
  adminUpdateGuide: (data) => request('/guides/admin/update', 'POST', data),
  adminGetMessages: (params) => request('/messages/admin/list?' + objToParams(params)),
  adminReplyMessage: (messageId, data) => request('/messages/reply/' + messageId, 'POST', data),
  adminCreateCoupon: (data) => request('/coupons/create', 'POST', data),
  adminIssueCoupon: (data) => request('/coupons/issue', 'POST', data),
  adminGetCoupons: () => request('/coupons/admin/list')
};

function objToParams(obj) {
  if (!obj) return '';
  const parts = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  return parts.join('&');
}
