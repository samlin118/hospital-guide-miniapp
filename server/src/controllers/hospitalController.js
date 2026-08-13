const { success, fail } = require('../utils/response');
const { Hospital, Department } = require('../models');

exports.create = async (req, res) => {
  try {
    const { name, address, phone, level, image, lat, lng } = req.body;
    const hospital = await Hospital.create({ name, address, phone, level, image, lat, lng });
    success(res, hospital);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.list = async (req, res) => {
  try {
    const { keyword, page = 1, size = 10 } = req.query;
    const result = await Hospital.list({ keyword, page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return fail(res, 'Hospital not found');
    const departments = await Department.findByHospital(hospitalId);
    success(res, { ...hospital, departments });
  } catch (err) {
    fail(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { id, hospital_id, ...data } = req.body;
    const hospitalId = req.params.hospitalId || id || hospital_id;
    if (!hospitalId) return fail(res, 'Hospital id required');
    await Hospital.update(hospitalId, data);
    success(res, null, 'Hospital updated');
  } catch (err) {
    fail(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id, hospital_id } = req.body;
    const hospitalId = req.params.hospitalId || id || hospital_id;
    if (!hospitalId) return fail(res, 'Hospital id required');
    await Hospital.delete(hospitalId);
    success(res, null, 'Hospital deleted');
  } catch (err) {
    fail(res, err.message);
  }
};
