const settingsModel = require('../models/settingsModel');

exports.get = async (account_uuid) => settingsModel.get(account_uuid);