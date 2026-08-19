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
router.post('/admin/update', authMiddleware(), adminMiddleware, guideController.adminUpdate);
// 导诊员-医院-科室 分配管理（管理端）
router.get('/assignments/:guideId', authMiddleware(), adminMiddleware, guideController.getAssignments);
router.post('/assignments', authMiddleware(), adminMiddleware, guideController.assignDepartments);

module.exports = router;
