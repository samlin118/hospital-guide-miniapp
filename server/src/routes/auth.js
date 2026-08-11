const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/login/patient', authController.patientLogin);
router.post('/login/guide', authController.guideLogin);
router.post('/login/admin', authController.adminLogin);
router.get('/profile', authMiddleware(), authController.getProfile);

module.exports = router;
