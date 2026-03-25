const hiddenNotesModel = require('../models/hiddenNotesModel');

exports.createNote = async (account_uuid, data) => hiddenNotesModel.create(account_uuid, data);
exports.getNotes = async (account_uuid, pagination) => hiddenNotesModel.findAll(account_uuid, pagination);
exports.getNote = async (account_uuid, id) => hiddenNotesModel.findById(account_uuid, id);
exports.getNoteByJobuuid = async (account_uuid, jobuuid) => hiddenNotesModel.findByJobuuid(account_uuid, jobuuid);
exports.updateNote = async (account_uuid, id, data) => hiddenNotesModel.update(account_uuid, id, data);
exports.deleteNote = async (account_uuid, id) => hiddenNotesModel.delete(account_uuid, id);