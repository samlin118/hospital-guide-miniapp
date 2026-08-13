const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/register', guideController.register);
router.post('/profile', authMiddleware(), guideController.updateProfile);
router.get('/profile', authMiddleware(), guideController.getProfile);
router.get('/detail/:guideId', guideController.getDetail);
router.get('/list', guideController.listByHospital);
router.get('/admin/list', authMiddleware(), adminMiddleware, guideController.list);

module.exports = router;
