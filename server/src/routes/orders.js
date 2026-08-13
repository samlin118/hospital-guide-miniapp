const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware(), orderController.create);
router.get('/my', authMiddleware(), orderController.listByPatient);
router.get('/guide', authMiddleware(), orderController.listByGuide);
router.get('/detail/:orderId', authMiddleware(), orderController.getDetail);
router.post('/cancel', authMiddleware(), orderController.cancel);
router.post('/complete', authMiddleware(), orderController.confirmComplete);
router.get('/admin/list', authMiddleware(), adminMiddleware, orderController.listAll);

module.exports = router;
