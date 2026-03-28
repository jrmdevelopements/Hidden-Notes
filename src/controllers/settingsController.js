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

    const roles = await settingsService.get(accountUUID);

    res.status(200).json({
      success: true,
      roles: Array.isArray(roles) ? roles : []
    });

  } catch (error) {
    console.error('getRoleSettings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roles'
    });
  }
};


// ✅ Save Roles (CREATE with fallback to UPDATE)
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

    const cleanedRoles = roles
      .filter(r => typeof r === 'string' && r.trim())
      .map(r => r.trim());

    // 🔥 CREATE → if duplicate → UPDATE
    try {
      await settingsService.create(accountUUID, cleanedRoles);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        await settingsService.update(accountUUID, cleanedRoles);
      } else {
        throw err;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Roles saved successfully.',
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


// ✅ Update Roles (STRICT UPDATE ONLY)
exports.updateRoleSettings = async (req, res) => {
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

    const cleanedRoles = roles
      .filter(r => typeof r === 'string' && r.trim())
      .map(r => r.trim());

    await settingsService.update(accountUUID, cleanedRoles);

    res.status(200).json({
      success: true,
      message: 'Roles updated successfully.',
      roles: cleanedRoles
    });

  } catch (error) {
    console.error('updateRoleSettings error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update roles'
    });
  }
};