const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/dashboard', authMiddleware(), adminMiddleware, adminController.dashboard);
router.get('/statistics', authMiddleware(), adminMiddleware, adminController.statistics);

module.exports = router;
