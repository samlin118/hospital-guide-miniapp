const { success, fail } = require('../utils/response');
const Message = require('../models/Message');

exports.create = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.create({ user_id: req.user.id, role: req.user.type, content });
    success(res, message);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listByUser = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = await Message.findByUser(req.user.id, req.user.type, { page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.listAll = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = await Message.findAll({ page: Number(page), pageSize: Number(size) });
    success(res, result);
  } catch (err) {
    fail(res, err.message);
  }
};

exports.reply = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reply } = req.body;
    await Message.reply(messageId, reply);
    success(res, null, 'Reply sent');
  } catch (err) {
    fail(res, err.message);
  }
};
