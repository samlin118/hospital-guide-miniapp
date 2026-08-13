const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware(), ratingController.create);
router.get('/guide/:guideId', ratingController.listByGuide);
router.get('/my', authMiddleware(), ratingController.listByPatient);
router.get('/check', authMiddleware(), ratingController.check);

module.exports = router;
