const asyncHandler = require('../utils/asyncHandler');
const service = require('../services/noteService');

exports.create = asyncHandler(async (req, res) => {
  const result = await service.createNote(req.body);
  res.status(201).json({ id: result.insertId, ...req.body });
});

exports.getAll = asyncHandler(async (req, res) => {
  const notes = await service.getNotes(req.pagination);
  res.json(notes);
});

exports.getOne = asyncHandler(async (req, res) => {
  const note = await service.getNote(req.params.id);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json(note);
});

exports.getOnejobuuid = asyncHandler(async (req, res) => {
  const note = await service.getNoteJobuuid(req.params.jobuuid);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json(note);
});


exports.update = asyncHandler(async (req, res) => {
  const result = await service.updateNote(req.params.id, req.body);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json({ message: 'Note updated successfully' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await service.deleteNote(req.params.id);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json({ message: 'Note deleted successfully' });
});