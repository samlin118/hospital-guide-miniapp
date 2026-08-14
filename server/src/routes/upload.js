const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.post('/avatar', uploadController.avatar);

module.exports = router;
