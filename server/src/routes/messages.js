const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware(), messageController.create);
router.get('/my', authMiddleware(), messageController.listByUser);
router.get('/admin/list', authMiddleware(), adminMiddleware, messageController.listAll);
router.post('/reply/:messageId', authMiddleware(), adminMiddleware, messageController.reply);

module.exports = router;
