const db = require('../config/db');

exports.getByKey = async (key) => {
    const [rows] = await db.query('SELECT setting_value FROM app_settings WHERE setting_key = ?', [key]);
    return rows[0] ? JSON.parse(rows[0].setting_value) : null;
};

exports.updateByKey = async (key, value) => {
    const jsonValue = JSON.stringify(value);
    const [result] = await db.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, jsonValue, jsonValue]
    );
    return result;
};