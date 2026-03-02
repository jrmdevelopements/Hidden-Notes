const repo = require('../repositories/noteRepository');

exports.createNote = async (data) => repo.create(data);
exports.getNotes = async (pagination) => repo.findAll(pagination);
exports.getNote = async (id) => repo.findById(id);
exports.getNoteJobuuid = async (jobuuid) => repo.findByjobuuid(jobuuid);
exports.updateNote = async (id, data) => repo.update(id, data);
exports.deleteNote = async (id) => repo.delete(id);
