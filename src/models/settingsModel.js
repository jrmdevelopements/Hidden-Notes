const db = require('../config/db');

class SettingsModel {
  /**
   * Get a specific setting key for an account.
   * @param {string} account_uuid
   * @param {string} key
   * @returns {any} value or null if not found
   */
  static async getByKey(account_uuid, key) {
    const [rows] = await db.query(
      'SELECT setting_value FROM app_settings WHERE account_uuid = ?',
      [account_uuid]
    );
    if (!rows[0]) return null;
    const settings = JSON.parse(rows[0].setting_value);
    return settings[key] ?? null;
  }

  /**
   * Update a specific setting key for an account.
   * This method works even without a unique index on account_uuid.
   * It first attempts to update; if no rows are updated, it inserts a new row.
   * @param {string} account_uuid
   * @param {string} key
   * @param {any} value
   * @returns {object} result from the last query
   */
  static async updateByKey(account_uuid, key, value) {
    // First, check if a row exists and get current settings
    const [rows] = await db.query(
      'SELECT setting_value FROM app_settings WHERE account_uuid = ?',
      [account_uuid]
    );
    let settings = {};
    if (rows[0]) {
      settings = JSON.parse(rows[0].setting_value);
    }
    settings[key] = value;
    const jsonValue = JSON.stringify(settings);

    // Attempt to update
    const [updateResult] = await db.query(
      'UPDATE app_settings SET setting_value = ? WHERE account_uuid = ?',
      [jsonValue, account_uuid]
    );

    // If no row was updated, insert a new one
    if (updateResult.affectedRows === 0) {
      const [insertResult] = await db.query(
        'INSERT INTO app_settings (account_uuid, setting_value) VALUES (?, ?)',
        [account_uuid, jsonValue]
      );
      return insertResult;
    }

    return updateResult;
  }
}

module.exports = SettingsModel;