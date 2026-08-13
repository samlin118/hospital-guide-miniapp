const { success, fail } = require('../utils/response');
const { Patient, Guide, Admin } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcryptjs');

exports.patientLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const patient = await Patient.findByPhone(phone);
    if (!patient) return fail(res, 'Patient not found');
    if (!patient.password) return fail(res, '该账号未设置密码，请重新注册');
    const valid = await bcrypt.compare(password, patient.password);
    if (!valid) return fail(res, 'Invalid password');
    const token = jwt.sign({ id: patient.id, role: 'patient', type: 'patient' }, config.jwt.secret, { expiresIn: '7d' });
    success(res, { token, patient });
  } catch (err) {
    fail(res, err.message);
  }
};

exports.guideLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const guide = await Guide.findByPhone(phone);
    if (!guide) return fail(res, 'Guide not found');
    if (!guide.password) return fail(res, '该账号未设置密码，请重新注册');
    const valid = await bcrypt.compare(password, guide.password);
    if (!valid) return fail(res, 'Invalid password');
    const token = jwt.sign({ id: guide.id, role: 'guide', type: 'guide' }, config.jwt.secret, { expiresIn: '7d' });
    success(res, { token, guide });
  } catch (err) {
    fail(res, err.message);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findByUsername(username);
    if (!admin) return fail(res, 'Admin not found');
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return fail(res, 'Invalid password');
    const token = jwt.sign({ id: admin.id, role: 'admin', type: 'admin' }, config.jwt.secret, { expiresIn: '7d' });
    success(res, { token, admin });
  } catch (err) {
    fail(res, err.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    let user;
    if (role === 'patient') user = await Patient.findById(id);
    else if (role === 'guide') user = await Guide.findById(id);
    else if (role === 'admin') user = await Admin.findById(id);
    if (!user) return fail(res, 'User not found');
    success(res, user);
  } catch (err) {
    fail(res, err.message);
  }
};
