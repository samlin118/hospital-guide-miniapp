-- LL 导诊员(id=15) 订单/支付/评价演示数据（可重复执行）
-- 说明：使用显式 ID(20+) 避免与既有数据冲突；INSERT IGNORE 幂等
USE hospital_service;

-- 1) 导诊员-医院-科室 分配（让 LL 在对应医院/科室下可见）
INSERT IGNORE INTO guide_assignments (guide_id, hospital_id, department_id) VALUES
(15, 2, 2),   -- 北京协和医院 内科
(15, 2, 14),  -- 北京协和医院 儿科
(15, 2, 15),  -- 北京协和医院 心血管内科
(15, 3, 3),   -- 北京大学第一医院 外科
(15, 3, 19),  -- 北京大学第一医院 消化内科
(15, 6, 6);   -- 广州中山大学附属第一医院 骨科

-- 2) 订单（5 单已完成 + 1 单已支付待服务 + 1 单待支付）
INSERT IGNORE INTO orders (id, order_no, patient_id, guide_id, hospital_id, department_id, date, start_time, duration, base_amount, coupon_id, discount_amount, final_amount, status, payment_method) VALUES
(20, 'HG20260817006', 10, 15, 2, 2,  '2026-08-18', '09:00:00', 2, 50, NULL, 0, 50, 3, 'wechat'),
(21, 'HG20260817007', 11, 15, 2, 14, '2026-08-19', '10:00:00', 2, 50, NULL, 0, 50, 3, 'wechat'),
(22, 'HG20260817008', 12, 15, 3, 3,  '2026-08-20', '14:00:00', 3, 60, NULL, 0, 60, 3, 'alipay'),
(23, 'HG20260817009', 13, 15, 3, 19, '2026-08-21', '09:30:00', 2, 50, 1, 5, 45, 3, 'wechat'),
(24, 'HG20260817010', 14, 15, 6, 6,  '2026-08-22', '15:00:00', 3, 60, NULL, 0, 60, 3, 'wechat'),
(25, 'HG20260817011', 10, 15, 2, 15, '2026-08-23', '08:00:00', 2, 50, NULL, 0, 50, 1, 'wechat'),
(26, 'HG20260817012', 11, 15, 2, 2,  '2026-08-24', '11:00:00', 2, 50, NULL, 0, 50, 0, NULL);

-- 3) 支付记录（对应 6 单已支付的订单）
INSERT IGNORE INTO payments (id, order_id, method, trade_no, amount, status) VALUES
(20, 20, 'wechat', 'wx20260818006', 50.00, 1),
(21, 21, 'wechat', 'wx20260819006', 50.00, 1),
(22, 22, 'alipay', 'alipay20260820006', 60.00, 1),
(23, 23, 'wechat', 'wx20260821006', 45.00, 1),
(24, 24, 'wechat', 'wx20260822006', 60.00, 1),
(25, 25, 'wechat', 'wx20260823006', 50.00, 1);

-- 4) 评价（对应已完成的订单 20-24）
INSERT IGNORE INTO ratings (id, order_id, patient_id, guide_id, score, content, anonymous) VALUES
(20, 20, 10, 15, 5, 'LL 导诊非常专业，全程陪同挂号取药，服务很贴心。', 0),
(21, 21, 11, 15, 5, '带孩子就诊，LL 很有耐心，路线指引清晰。', 1),
(22, 22, 12, 15, 4, '整体不错，术前提醒到位，就是等得稍久。', 0),
(23, 23, 13, 15, 5, '很负责，帮忙安排了加号，节省大量时间。', 0),
(24, 24, 14, 15, 5, '陪诊体验很好，细节考虑周到。', 1);

-- 5) 更新 LL 的综合评分与接单量（与后端 updateScore 逻辑一致：评分=AVG 四舍五入1位，单量=评价数）
UPDATE guides
SET score = (SELECT ROUND(AVG(score), 1) FROM ratings WHERE guide_id = 15),
    service_count = (SELECT COUNT(*) FROM ratings WHERE guide_id = 15)
WHERE id = 15;
