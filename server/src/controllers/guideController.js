const { success, fail } = require('../utils/response');
const Guide = require('../models/Guide');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, phone, id_card, address, password, avatar } = req.body;
    if (!password || password.length < 6) return fail(res, 'Password must be at least 6 characters');
    const existing = await Guide.findByPhone(phone);
    if (existing) return fail(res, 'Phone already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const guide = await Guide.create({ name, phone, id_card, address, password: passwordHash, avatar });
    success(res, { id: guide.id });
  } catch (err) {
    fail(res, err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, address, avatar, status } = req.body;
    await Guide.update(req.user.id, { name, address, avatar, status });
    success(res, null, 'Profile updated');
  } catch (err) {
    fail(res, err.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const guide = await Guide.findById(req.user.id);
    if (!guide) return fail(res, 'Guide not found');
    success(res, guide);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const { guideId } = req.params;
    const guide = await Guide.findById(guideId);
    if (!guide) return fail(res, 'Guide not found');
    const ratings = await Guide.getRecentRatings(guideId);
    success(res, { ...guide, ratings });
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listByHospital = async (req, res) => {
  try {
    const { hospitalId, departmentId, page = 1, size = 10, keyword } = req.query;
    const result = await Guide.list({ keyword, page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.list = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = await Guide.list({ page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};
