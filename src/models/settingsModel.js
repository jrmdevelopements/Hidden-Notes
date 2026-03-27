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
    'SELECT setting_value FROM app_settings WHERE account_uuid = ? LIMIT 1',
    [account_uuid]
  );

  if (!rows.length) return null;

  let settings = rows[0].setting_value;

  // ✅ Parse if string
  if (typeof settings === 'string') {
    try {
      settings = JSON.parse(settings);
    } catch (err) {
      console.error('Invalid JSON in setting_value:', err);
      return null;
    }
  }

    console.log(settings);
    
    
  // ✅ Ensure valid object
  if (!settings || typeof settings !== 'object') {
    return null;
  }

  let value = settings[key];

  // ❗ Key missing
  if (value === undefined) {
    console.warn(`Settings key "${key}" not found for account: ${account_uuid}`);
    return null;
  }

  // ✅ Handle double-encoded JSON
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (e) {
      // ignore if not JSON
    }
  }

  return value;
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
  // Get existing settings
  const [rows] = await db.query(
    'SELECT setting_value FROM app_settings WHERE account_uuid = ? LIMIT 1',
    [account_uuid]
  );

  let settings = {};

  if (rows.length) {
    settings = rows[0].setting_value;

    // ✅ Parse only if it's string
    if (typeof settings === 'string') {
      try {
        settings = JSON.parse(settings);
      } catch (err) {
        console.error('Invalid JSON in DB:', err);
        settings = {};
      }
    }
  }

  // ✅ Ensure it's object
  if (!settings || typeof settings !== 'object') {
    settings = {};
  }

  // ✅ Update key
  settings[key] = value;

  // ✅ Save back (stringify ONLY here)
  await db.query(
    'UPDATE app_settings SET setting_value = ? WHERE account_uuid = ?',
    [JSON.stringify(settings), account_uuid]
  );

  return true;
}
}

module.exports = SettingsModel;