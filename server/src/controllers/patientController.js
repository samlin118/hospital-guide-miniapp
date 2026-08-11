const { success, fail } = require('../utils/response');
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, phone, id_card, address } = req.body;
    const existing = await Patient.findByPhone(phone);
    if (existing) return fail(res, 'Phone already registered');
    const patient = await Patient.create({ name, phone, id_card, address });
    success(res, { id: patient.id });
  } catch (err) {
    fail(res, err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, address, avatar } = req.body;
    await Patient.update(req.user.id, { name, address, avatar });
    success(res, null, 'Profile updated');
  } catch (err) {
    fail(res, err.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) return fail(res, 'Patient not found');
    success(res, patient);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.list = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = await Patient.list(Number(page), Number(size));
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};
