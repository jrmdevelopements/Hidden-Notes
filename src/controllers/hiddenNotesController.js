const asyncHandler = require('../utils/asyncHandler');
const hiddenNotesService = require('../services/hiddenNotesService');
const settingsService = require('../services/settingsService');

exports.create = asyncHandler(async (req, res) => {
  const account_uuid = req.header('x-account-uuid');
  if (!account_uuid) return res.status(400).json({ message: 'Account UUID required' });

  const result = await hiddenNotesService.createNote(account_uuid, req.body);
  res.status(201).json({ id: result.insertId, ...req.body });
});

exports.getAll = asyncHandler(async (req, res) => {
  const account_uuid = req.header('x-account-uuid');
  if (!account_uuid) return res.status(400).json({ message: 'Account UUID required' });

  const notes = await hiddenNotesService.getNotes(account_uuid, req.pagination);
  res.json(notes);
});

exports.getOne = asyncHandler(async (req, res) => {
  const account_uuid = req.header('x-account-uuid');
  if (!account_uuid) return res.status(400).json({ message: 'Account UUID required' });

  const note = await hiddenNotesService.getNote(account_uuid, req.params.id);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

exports.getOneByJobuuid = asyncHandler(async (req, res) => {
  const account_uuid = req.header('x-account-uuid');
  const userRole = req.header('x-user-role');
  const { jobuuid } = req.params;

  if (!account_uuid) {
    return res.status(400).json({ message: 'Account UUID required' });
  }

  if (!userRole) {
    return res.status(400).json({ message: 'User role required' });
  }

  if (!jobuuid) {
    return res.status(400).json({ message: 'Job UUID required' });
  }

  // ✅ Fetch allowed roles
  const allowedRoles = await settingsService.getByKey(
    account_uuid  );

  
  console.log(allowedRoles);
  
  
  // ✅ Ensure array
  const finalAllowedRoles = Array.isArray(allowedRoles) ? allowedRoles : [];

  // ✅ Normalize roles (case-insensitive comparison)
  const normalizedAllowedRoles = finalAllowedRoles.map(r =>
    String(r).toLowerCase()
  );

  const normalizedUserRole = String(userRole).toLowerCase();

  // ✅ Debug
  console.log('Allowed Roles:', normalizedAllowedRoles);
  console.log('User Role:', normalizedUserRole);

  // ✅ Permission check
  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    return res.status(403).json({
      message: 'Your role does not have permission to view hidden notes.'
    });
  }

  // ✅ Fetch note
  const note = await hiddenNotesService.getNoteByJobuuid(
    account_uuid,
    jobuuid
  );

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.status(200).json({
    success: true,
    data: note
  });
});



exports.getOneByJobuuidold = asyncHandler(async (req, res) => {
  const account_uuid = req.header('x-account-uuid');
  if (!account_uuid) return res.status(400).json({ message: 'Account UUID required' });

  const { jobuuid } = req.params;
  const userRole = req.header('x-user-role');

  // Fetch allowed roles for this account
  const allowedRoles = await settingsService.get(account_uuid);
  res.status(200).json(allowedRoles);
  
  // if (!allowedRoles || !allowedRoles.includes(userRole)) {
  //   return res.status(403).json({ message: 'Your role does not have permission to view hidden notes.' });
  // }

  // const note = await hiddenNotesService.getNoteByJobuuid(account_uuid, jobuuid);
  // if (!note) return res.status(404).json({ message: 'Note not found' });

  res.json(note);
});

exports.update = asyncHandler(async (req, res) => {
  const account_uuid = req.header('x-account-uuid');
  if (!account_uuid) return res.status(400).json({ message: 'Account UUID required' });

  const result = await hiddenNotesService.updateNote(account_uuid, req.params.id, req.body);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json({ message: 'Note updated successfully' });
});

exports.remove = asyncHandler(async (req, res) => {
  const account_uuid = req.header('x-account-uuid');
  if (!account_uuid) return res.status(400).json({ message: 'Account UUID required' });

  const result = await hiddenNotesService.deleteNote(account_uuid, req.params.id);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json({ message: 'Note deleted successfully' });
});