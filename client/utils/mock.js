const MOCK_HOSPITALS = [
  { id: 1, name: '北京协和医院', address: '北京市东城区帅府园1号', level: '三甲', image: '', score: 4.8, distance: '1.2km' },
  { id: 2, name: '北京大学第一医院', address: '北京市西城区西什库大街8号', level: '三甲', image: '', score: 4.7, distance: '2.5km' },
  { id: 3, name: '北京朝阳医院', address: '北京市朝阳区工人体育场南路8号', level: '三甲', image: '', score: 4.6, distance: '3.8km' },
  { id: 4, name: '北京友谊医院', address: '北京市西城区永安路95号', level: '三甲', image: '', score: 4.5, distance: '4.1km' },
  { id: 5, name: '北京人民医院', address: '北京市西城区西直门南大街11号', level: '三甲', image: '', score: 4.7, distance: '5.0km' },
  { id: 6, name: '北京安贞医院', address: '北京市朝阳区安贞路2号', level: '三甲', image: '', score: 4.6, distance: '6.2km' },
  { id: 7, name: '社区卫生服务中心', address: '北京市海淀区中关村大街29号', level: '社区医院', image: '', score: 4.2, distance: '0.8km' }
];

const MOCK_DEPARTMENTS = [
  { id: 1, hospital_id: 1, name: '内科', description: '内科疾病诊疗' },
  { id: 2, hospital_id: 1, name: '外科', description: '外科疾病诊疗' },
  { id: 3, hospital_id: 1, name: '儿科', description: '儿童疾病诊疗' },
  { id: 4, hospital_id: 1, name: '妇产科', description: '妇科及产科服务' },
  { id: 5, hospital_id: 1, name: '骨科', description: '骨骼关节疾病' },
  { id: 6, hospital_id: 1, name: '眼科', description: '眼部疾病诊疗' },
  { id: 7, hospital_id: 1, name: '耳鼻喉科', description: '耳鼻喉疾病' },
  { id: 8, hospital_id: 1, name: '口腔科', description: '口腔疾病诊疗' }
];

const MOCK_GUIDES = [
  { id: 1, name: '张护士', avatar: '', score: 4.9, service_count: 328, price: 50, hospital_id: 1, department_id: 1, status: 1, desc: '10年导诊经验，熟悉协和各科室流程' },
  { id: 2, name: '李导诊', avatar: '', score: 4.8, service_count: 256, price: 50, hospital_id: 1, department_id: 2, status: 1, desc: '资深导诊员，服务耐心细致' },
  { id: 3, name: '王助理', avatar: '', score: 4.7, service_count: 189, price: 50, hospital_id: 1, department_id: 3, status: 1, desc: '熟悉儿科就诊流程' },
  { id: 4, name: '赵导医', avatar: '', score: 4.9, service_count: 412, price: 50, hospital_id: 2, department_id: 1, status: 1, desc: '北大医院金牌导诊，好评如潮' },
  { id: 5, name: '刘向导', avatar: '', score: 4.6, service_count: 167, price: 50, hospital_id: 2, department_id: 4, status: 1, desc: '妇产科导诊专家' },
  { id: 6, name: '陈陪诊', avatar: '', score: 4.8, service_count: 298, price: 50, hospital_id: 3, department_id: 1, status: 1, desc: '朝阳医院资深导诊' }
];

const MOCK_BANNERS = [
  { id: 1, image: '', url: '', title: '新用户专享优惠券' },
  { id: 2, image: '', url: '', title: '金牌导诊员限时特惠' },
  { id: 3, image: '', url: '', title: '三甲医院导诊服务' }
];

const MOCK_ORDERS = [
  { id: 1, order_no: 'HG20240101001', patient_id: 1, guide_id: 1, hospital_id: 1, department_id: 1, date: '2024-01-15', start_time: '09:00', duration: 3, base_amount: 60, discount_amount: 0, final_amount: 60, status: 3, payment_method: 'wechat', created_at: '2024-01-14T10:00:00' },
  { id: 2, order_no: 'HG20240101002', patient_id: 1, guide_id: 2, hospital_id: 1, department_id: 2, date: '2024-01-20', start_time: '14:00', duration: 2, base_amount: 50, discount_amount: 5, final_amount: 45, status: 1, payment_method: 'wechat', created_at: '2024-01-19T15:00:00' }
];

const MOCK_COUPONS = [
  { id: 1, name: '新客9折券', discount: 9.0, min_amount: 50, total_count: 100, remain_count: 85, expire_days: 30 },
  { id: 2, name: '8折优惠券', discount: 8.0, min_amount: 100, total_count: 50, remain_count: 30, expire_days: 15 },
  { id: 3, name: '7.5折体验券', discount: 7.5, min_amount: 80, total_count: 30, remain_count: 10, expire_days: 7 }
];

const MOCK_RATINGS = [
  { id: 1, guide_id: 1, score: 5, anonymous: true, content: '服务非常耐心，全程陪同挂号取药，很省心！' },
  { id: 2, guide_id: 1, score: 4, anonymous: false, content: '路线指引清晰，节省了很多排队时间。' },
  { id: 3, guide_id: 2, score: 5, anonymous: true, content: '导诊员很专业，态度特别好。' },
  { id: 4, guide_id: 2, score: 4, anonymous: true, content: '整体不错，提前告知了注意事项。' },
  { id: 5, guide_id: 3, score: 5, anonymous: false, content: '带孩子看病全程帮忙，非常贴心。' }
];

function getBanners() {
  return MOCK_BANNERS;
}

function getHospitals() {
  return MOCK_HOSPITALS;
}

function getDepartments() {
  return MOCK_DEPARTMENTS;
}

function getGuides() {
  return MOCK_GUIDES;
}

function getRatings(guideId) {
  return MOCK_RATINGS.filter(r => !guideId || r.guide_id === guideId);
}

module.exports = {
  MOCK_HOSPITALS,
  MOCK_DEPARTMENTS,
  MOCK_GUIDES,
  MOCK_BANNERS,
  MOCK_ORDERS,
  MOCK_COUPONS,
  MOCK_RATINGS,
  getBanners,
  getHospitals,
  getDepartments,
  getGuides,
  getRatings
};
