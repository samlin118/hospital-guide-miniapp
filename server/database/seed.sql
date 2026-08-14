-- 医导通 · 演示假数据（每个表 5 条）
-- 患者/导诊员密码统一为 123456
-- 说明：本脚本在已存在部分数据的库上执行，使用显式 ID 避免主键冲突；仅执行一次。

-- 医院（5）
INSERT INTO hospitals (id, name, address, phone, level, image, lat, lng) VALUES
(2, '北京协和医院', '北京市东城区帅府园1号', '010-69156114', '三甲', '', 39.9163447, 116.4142866),
(3, '北京大学第一医院', '北京市西城区西什库大街8号', '010-83572211', '三甲', '', 39.9228288, 116.3757381),
(4, '北京朝阳医院', '北京市朝阳区工人体育场南路8号', '010-85231000', '三甲', '', 39.9310018, 116.4470434),
(5, '上海瑞金医院', '上海市黄浦区瑞金二路197号', '021-64370045', '三甲', '', 31.2128104, 121.4666518),
(6, '广州中山大学附属第一医院', '广州市越秀区中山二路58号', '020-87755766', '三甲', '', 23.1321913, 113.2838622);

-- 科室（5，各属一家医院）
INSERT INTO departments (id, hospital_id, name, description) VALUES
(2, 2, '内科', '内科常见病多发病的诊疗'),
(3, 3, '外科', '普外科及微创手术治疗'),
(4, 4, '儿科', '儿童常见病与生长发育评估'),
(5, 5, '妇产科', '妇科疾病及围产期保健'),
(6, 6, '骨科', '骨骼关节疾病与创伤治疗');

-- 患者（5，密码 123456）
INSERT INTO patients (id, name, phone, id_card, password, address) VALUES
(10, '张三', '13800000001', '110101199001011111', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '北京市朝阳区建国路88号'),
(11, '李四', '13800000002', '110101199001012222', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '北京市海淀区中关村大街'),
(12, '王五', '13800000003', '110101199001013333', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '上海市浦东新区世纪大道'),
(13, '赵六', '13800000004', '110101199001014444', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '广州市天河区体育西路'),
(14, '孙七', '13800000005', '110101199001015555', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '深圳市南山区科技园');

-- 导诊员（5，密码 123456）
INSERT INTO guides (id, name, phone, id_card, password, address, score, service_count, status) VALUES
(10, '张护士', '13900000011', '110101198801011111', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '北京市东城区', 4.9, 328, 1),
(11, '李导诊', '13900000012', '110101198801012222', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '北京市西城区', 4.8, 256, 1),
(12, '王助理', '13900000013', '110101198801013333', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '上海市黄浦区', 4.7, 189, 1),
(13, '赵导医', '13900000014', '110101198801014444', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '广州市越秀区', 4.9, 412, 1),
(14, '刘向导', '13900000015', '110101198801015555', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '深圳市南山区', 4.6, 167, 1);

-- 优惠券（5）
INSERT INTO coupons (id, name, discount, min_amount, total_count, remain_count, expire_days) VALUES
(1, '新客9折券', 9.0, 50, 100, 85, 30),
(2, '8折优惠券', 8.0, 100, 50, 30, 15),
(3, '7.5折体验券', 7.5, 80, 30, 10, 7),
(4, '老客户8.5折券', 8.5, 60, 200, 120, 30),
(5, '会员7折券', 7.0, 100, 100, 40, 20);

-- 订单（5，关联新患者/导诊员/医院/科室）
INSERT INTO orders (id, order_no, patient_id, guide_id, hospital_id, department_id, date, start_time, duration, base_amount, discount_amount, final_amount, status, payment_method) VALUES
(10, 'HG20260813001', 10, 10, 2, 2, '2026-08-15', '09:00:00', 2, 50, 0, 50, 3, 'wechat'),
(11, 'HG20260813002', 11, 11, 3, 3, '2026-08-16', '10:00:00', 3, 60, 0, 60, 3, 'wechat'),
(12, 'HG20260813003', 12, 12, 4, 4, '2026-08-17', '14:00:00', 2, 50, 0, 50, 1, 'alipay'),
(13, 'HG20260813004', 13, 13, 5, 5, '2026-08-18', '09:30:00', 2, 50, 5, 45, 3, 'wechat'),
(14, 'HG20260813005', 14, 14, 6, 6, '2026-08-19', '15:00:00', 4, 70, 0, 70, 0, NULL);

-- 支付记录（5，对应新订单）
INSERT INTO payments (id, order_id, method, trade_no, amount, status) VALUES
(10, 10, 'wechat', 'wx20260815001', 50.00, 1),
(11, 11, 'wechat', 'wx20260816001', 60.00, 1),
(12, 12, 'alipay', 'alipay20260817001', 50.00, 1),
(13, 13, 'wechat', 'wx20260818001', 45.00, 1),
(14, 14, 'wechat', 'wx20260819001', 70.00, 0);

-- 评价（5，对应新订单）
INSERT INTO ratings (id, order_id, patient_id, guide_id, score, content, anonymous) VALUES
(10, 10, 10, 10, 5, '导诊服务非常耐心，全程陪同挂号取药。', 0),
(11, 11, 11, 11, 4, '路线指引清晰，节省了很多排队时间。', 1),
(12, 12, 12, 12, 5, '服务专业，提前告知注意事项。', 0),
(13, 13, 13, 13, 4, '整体不错，态度很好。', 1),
(14, 14, 14, 14, 5, '很贴心的陪诊服务，下次还会选择。', 0);

-- 用户优惠券（5）
INSERT INTO user_coupons (id, user_id, role, coupon_id, used, used_at, expire_at) VALUES
(1, 10, 'patient', 1, 0, NULL, '2026-09-12 00:00:00'),
(2, 11, 'patient', 2, 0, NULL, '2026-08-28 00:00:00'),
(3, 12, 'patient', 3, 1, '2026-08-13 10:00:00', '2026-08-20 00:00:00'),
(4, 13, 'patient', 4, 0, NULL, '2026-09-12 00:00:00'),
(5, 14, 'guide', 5, 0, NULL, '2026-09-02 00:00:00');

-- 留言（5）
INSERT INTO messages (id, user_id, role, content, reply, replied) VALUES
(10, 10, 'patient', '请问明天上午可以预约导诊吗？', '可以的，请提前下单预约。', 1),
(11, 11, 'patient', '导诊费用怎么计算？', NULL, 0),
(12, 12, 'patient', '能否指定一位女性导诊员？', '已记录，会尽量安排。', 1),
(13, 13, 'patient', '取消订单后多久退款？', '一般1-3个工作日原路退回。', 1),
(14, 14, 'patient', '陪诊可以帮忙取药吗？', NULL, 0);

-- 管理员（新增 4 个，加上原有 admin 共 5 个）
INSERT INTO admins (id, username, password, name) VALUES
(2, 'admin2', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '运营管理员'),
(3, 'admin3', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '内容管理员'),
(4, 'admin4', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '客服管理员'),
(5, 'admin5', '$2a$10$iurb5PBPG0eceHZvLswQbuTCKl14mBhPzn4KQII74xtc6QyNR7oH2', '财务管理员');
