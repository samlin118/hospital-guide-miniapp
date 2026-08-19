-- 新模型：待导诊(0)订单不分配导诊员，导诊员接单时才关联（可重复执行）
UPDATE orders SET guide_id = NULL WHERE status = 0 AND guide_id IS NOT NULL;

-- 为 LL(15) 和 张护士(10) 各添加一个「进行中(2)」订单（可重复执行）
INSERT IGNORE INTO orders
  (id, order_no, patient_id, guide_id, hospital_id, department_id, date, start_time, duration, base_amount, coupon_id, discount_amount, final_amount, payment_method, status, created_at)
VALUES
  (40, 'HGSEED004001', 12, 15, 1, 1, '2026-08-21', '09:00', 2, 160.00, NULL, 0.00, 160.00, NULL, 2, NOW()),
  (41, 'HGSEED004101', 14, 10, 1, 3, '2026-08-21', '10:00', 2, 120.00, NULL, 0.00, 120.00, NULL, 2, NOW());
