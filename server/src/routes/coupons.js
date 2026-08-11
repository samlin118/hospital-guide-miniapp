const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware(), adminMiddleware, couponController.create);
router.get('/list', couponController.list);
router.post('/issue', authMiddleware(), adminMiddleware, couponController.issueToUser);
router.get('/my', authMiddleware(), couponController.myCoupons);
router.get('/admin/list', authMiddleware(), adminMiddleware, couponController.listAll);

module.exports = router;
