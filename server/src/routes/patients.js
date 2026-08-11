const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/register', patientController.register);
router.post('/profile', authMiddleware(), patientController.updateProfile);
router.get('/profile', authMiddleware(), patientController.getProfile);
router.get('/list', authMiddleware(), adminMiddleware, patientController.list);

module.exports = router;
