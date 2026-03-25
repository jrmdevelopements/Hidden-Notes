const settingsModel = require('../models/settingsModel');

exports.getByKey = async (account_uuid, key) => settingsModel.getByKey(account_uuid, key);
exports.updateByKey = async (account_uuid, key, value) => settingsModel.updateByKey(account_uuid, key, value);