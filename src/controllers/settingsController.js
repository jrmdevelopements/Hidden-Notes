const SettingsModel = require('../models/settingsModel');

exports.getRoleSettings = async (req, res) => {
    try {
        const { accountUUID } = req.params;
        const key = `roles_${accountUUID}`;
        
        const roles = await SettingsModel.getByKey(key);
        
        // Return stored roles or a default if none exist
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
        const key = `roles_${accountUUID}`;

        if (!accountUUID || !Array.isArray(roles)) {
            return res.status(400).json({ success: false, error: "Invalid data provided." });
        }

        await SettingsModel.updateByKey(key, roles);
        res.json({ success: true, message: "Settings updated successfully." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};