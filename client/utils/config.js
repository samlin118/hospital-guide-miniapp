const app = getApp();

const CONFIG = {
  BASE_URL: app.globalData.serverUrl,

  PRICING: {
    BASE_HOURS: 2,
    BASE_PRICE: 50,
    HOURLY_RATE: 10
  },

  ORDER_STATUS: {
    0: { text: '待导诊', color: '#FF976A' },
    1: { text: '待支付', color: '#FF976A' },
    2: { text: '进行中', color: '#07C160' },
    3: { text: '已完成', color: '#999' },
    4: { text: '已取消', color: '#C8C9CC' }
  },

  ROLE: {
    PATIENT: 'patient',
    GUIDE: 'guide',
    ADMIN: 'admin'
  }
};

function calculateAmount(duration, price) {
  const p = price || CONFIG.PRICING.BASE_PRICE;
  return p * duration;
}

module.exports = { CONFIG, calculateAmount };
