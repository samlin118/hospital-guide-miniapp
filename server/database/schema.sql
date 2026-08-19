CREATE DATABASE IF NOT EXISTS hospital_service DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_service;

CREATE TABLE patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  id_card VARCHAR(18) NOT NULL UNIQUE,
  password VARCHAR(200) COMMENT 'bcrypt 哈希',
  address VARCHAR(200),
  openid VARCHAR(100) UNIQUE,
  avatar VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE guides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  id_card VARCHAR(18) NOT NULL UNIQUE,
  password VARCHAR(200) COMMENT 'bcrypt 哈希',
  address VARCHAR(200),
  openid VARCHAR(100) UNIQUE,
  avatar VARCHAR(500),
  score DECIMAL(2,1) DEFAULT 5.0,
  service_count INT DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 50.00 COMMENT '每小时报价(元)',
  status TINYINT DEFAULT 1 COMMENT '1:在线 0:离线',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE hospitals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200),
  phone VARCHAR(20),
  level VARCHAR(20) COMMENT '三甲/二甲/社区医院',
  image VARCHAR(500),
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hospital_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) NOT NULL UNIQUE,
  patient_id INT NOT NULL,
  guide_id INT NOT NULL,
  hospital_id INT NOT NULL,
  department_id INT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration DECIMAL(4,1) NOT NULL COMMENT '预约时长(小时)',
  base_amount DECIMAL(10,2) NOT NULL COMMENT '基础费用',
  coupon_id INT,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  final_amount DECIMAL(10,2) NOT NULL,
  status TINYINT DEFAULT 0 COMMENT '0:待支付 1:已支付 2:进行中 3:已完成 4:已取消',
  payment_method VARCHAR(20) COMMENT 'wechat/alipay',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  method VARCHAR(20) NOT NULL COMMENT 'wechat/alipay',
  trade_no VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  status TINYINT DEFAULT 0 COMMENT '0:待支付 1:支付成功 2:支付失败',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  patient_id INT NOT NULL,
  guide_id INT NOT NULL,
  score TINYINT NOT NULL COMMENT '1-5星',
  content TEXT,
  anonymous TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (guide_id) REFERENCES guides(id)
);

CREATE TABLE coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  discount DECIMAL(3,1) NOT NULL COMMENT '折扣率 9.0=9折',
  min_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '最低使用金额',
  total_count INT DEFAULT 0,
  remain_count INT DEFAULT 0,
  expire_days INT DEFAULT 30,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role VARCHAR(10) NOT NULL COMMENT 'patient/guide',
  coupon_id INT NOT NULL,
  used TINYINT DEFAULT 0,
  used_at DATETIME,
  expire_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role VARCHAR(10) NOT NULL COMMENT 'patient/guide',
  content TEXT NOT NULL,
  reply TEXT,
  replied TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 导诊员-医院-科室 分配表：一个导诊员可服务多家医院的多个科室
CREATE TABLE guide_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guide_id INT NOT NULL,
  hospital_id INT NOT NULL,
  department_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_guide_hosp_dept (guide_id, hospital_id, department_id),
  FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  name VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (username, password, name) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '系统管理员');
