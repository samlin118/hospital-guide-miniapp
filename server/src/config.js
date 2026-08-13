require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'hospital_service'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'hospital_guide_jwt_secret_2024',
    expiresIn: '7d'
  },
  wechat: {
    appid: process.env.WECHAT_APPID || 'wx_simulate_appid',
    secret: process.env.WECHAT_SECRET || 'wx_simulate_secret',
    mchid: process.env.WECHAT_MCHID || 'simulate_mchid',
    key: process.env.WECHAT_KEY || 'simulate_key'
  },
  alipay: {
    appId: process.env.ALIPAY_APPID || 'simulate_alipay_appid',
    privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
    publicKey: process.env.ALIPAY_PUBLIC_KEY || ''
  },
  pricing: {
    baseHours: 2,
    basePrice: 50,
    hourlyRate: 10
  }
};
