const settingsService = require('../services/settingsService');

// ✅ Get Roles
exports.getRoleSettings = async (req, res) => {
  try {
    const { accountUUID } = req.params;

    if (!accountUUID) {
      return res.status(400).json({
        success: false,
        error: 'Account UUID is required'
      });
    }

    const roles = await settingsService.getByKey(accountUUID, 'roles');

    res.status(200).json({
      success: true,
      roles: Array.isArray(roles) && roles.length
        ? roles
        : []
    });

  } catch (error) {
    console.error('getRoleSettings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roles'
    });
  }
};


// ✅ Save Roles
exports.saveRoleSettings = async (req, res) => {
  try {
    const { accountUUID, roles } = req.body;

    if (!accountUUID) {
      return res.status(400).json({
        success: false,
        error: 'Account UUID is required'
      });
    }

    if (!Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        error: 'Roles must be an array'
      });
    }

    // ✅ Normalize roles (remove empty + trim)
    const cleanedRoles = roles
      .filter(r => typeof r === 'string' && r.trim())
      .map(r => r.trim());

    await settingsService.updateByKey(accountUUID, 'roles', cleanedRoles);

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      roles: cleanedRoles
    });

  } catch (error) {
    console.error('saveRoleSettings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save roles'
    });
  }
};


// ✅ Update Hidden Notes Permissions
exports.updateHiddenNotesAllowedRoles = async (req, res) => {
  try {
    const { accountUUID, roles } = req.body;

    if (!accountUUID) {
      return res.status(400).json({
        success: false,
        error: 'Account UUID is required'
      });
    }

    if (!Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        error: 'Roles must be an array'
      });
    }

    // ✅ Normalize roles
    const cleanedRoles = roles
      .filter(r => typeof r === 'string' && r.trim())
      .map(r => r.trim().toLowerCase()); // 👈 important for consistency

    await settingsService.updateByKey(
      accountUUID,
      'roles',
      cleanedRoles
    );

    res.status(200).json({
      success: true,
      message: 'Permissions updated successfully.',
      roles: cleanedRoles
    });

  } catch (error) {
    console.error('updateHiddenNotesAllowedRoles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update permissions'
    });
  }
};