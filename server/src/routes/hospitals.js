const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware(), adminMiddleware, hospitalController.create);
router.get('/list', hospitalController.list);
router.get('/detail/:hospitalId', hospitalController.getDetail);
router.post('/update', authMiddleware(), adminMiddleware, hospitalController.update);
router.post('/delete', authMiddleware(), adminMiddleware, hospitalController.delete);

module.exports = router;
