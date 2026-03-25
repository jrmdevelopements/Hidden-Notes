const settingsService = require('../services/settingsService');

exports.getRoleSettings = async (req, res) => {
  try {
    const { accountUUID } = req.params;
    const roles = await settingsService.getByKey(accountUUID, 'roles');
    res.json({
      success: true,
      roles: roles || ["Default Business Owner Role"]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.saveRoleSettings = async (req, res) => {
  try {
    const { accountUUID, roles } = req.body;
    if (!accountUUID || !Array.isArray(roles)) {
      return res.status(400).json({ success: false, error: "Invalid data provided." });
    }

    await settingsService.updateByKey(accountUUID, 'roles', roles);
    res.json({ success: true, message: "Settings updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateHiddenNotesAllowedRoles = async (req, res) => {
  try {
    const { accountUUID, roles } = req.body;
    if (!accountUUID || !Array.isArray(roles)) {
      return res.status(400).json({ success: false, error: "Invalid data provided." });
    }

    await settingsService.updateByKey(accountUUID, 'hidden_notes_allowed_roles', roles);
    res.json({ success: true, message: "Permissions updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};