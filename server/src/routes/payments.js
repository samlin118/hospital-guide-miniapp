const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware(), paymentController.createPayment);
router.post('/notify', paymentController.notify);
router.get('/query', authMiddleware(), paymentController.queryPayment);

module.exports = router;
