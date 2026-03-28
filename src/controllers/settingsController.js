const SettingsModel = require('../models/settingsModel');

/**
 * Get role settings for an account
 */
exports.getRoleSettings = async (req, res) => {
  const { accountUUID } = req.params;

  try {
    const roles = await SettingsModel.get(accountUUID);
    res.json({ success: true, roles });
  } catch (err) {
    console.error('Error fetching role settings:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch role settings' });
  }
};

/**
 * Save role settings (create if not exists, otherwise update)
 */
exports.saveRoleSettings = async (req, res) => {
  const { accountUUID, roles } = req.body;

  if (!accountUUID || !Array.isArray(roles)) {
    return res.status(400).json({ success: false, error: 'Invalid request: accountUUID and roles array required' });
  }

  try {
    // Check if roles already exist for this account
    const existingRoles = await SettingsModel.get(accountUUID);

    if (existingRoles.length === 0) {
      // No record found → create new
      await SettingsModel.create(accountUUID, roles);
    } else {
      // Record exists → update
      await SettingsModel.update(accountUUID, roles);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error saving role settings:', err);
    res.status(500).json({ success: false, error: 'Failed to save roles' });
  }
};

/**
 * Update role settings (explicit update – expects existing record)
 */
exports.updateRoleSettings = async (req, res) => {
  const { accountUUID, roles } = req.body;

  if (!accountUUID || !Array.isArray(roles)) {
    return res.status(400).json({ success: false, error: 'Invalid request: accountUUID and roles array required' });
  }

  try {
    await SettingsModel.update(accountUUID, roles);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating role settings:', err);
    res.status(500).json({ success: false, error: 'Failed to update roles' });
  }
};