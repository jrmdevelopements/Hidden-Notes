const asyncHandler = require('../utils/asyncHandler');
const service = require('../services/noteService');
const settingsRepo = require('../repositories/settingsRepository');


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

// Updated: Fetch note WITH role check
exports.getOnejobuuid = asyncHandler(async (req, res) => {
    const { jobuuid } = req.params;
    const userRole = req.header('x-user-role'); // Pass the role from SMClient event.auth

    // Fetch dynamic allowed roles
    const allowedRoles = await settingsRepo.getByKey('hidden_notes_allowed_roles');

    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Your role does not have permission to view hidden notes.' });
    }

    const note = await noteService.getNoteJobuuid(jobuuid);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    
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

// New: Update allowed roles
exports.saveRoleSettings = asyncHandler(async (req, res) => {
    const { roles } = req.body; // Expects an array: ["Admin", "Editor"]
    await settingsRepo.updateByKey('hidden_notes_allowed_roles', roles);
    res.json({ message: 'Permissions updated successfully' });
});