const db = require("../config/db");

class SettingsModel {
  /**
   * Get a specific setting key for an account.
   */
  static async getByKey(account_uuid, key) {
    const [rows] = await db.query(
      "SELECT setting_value FROM app_settings WHERE account_uuid = ? LIMIT 1",
      [account_uuid],
    );

    if (!rows.length) return null;

    let settings = rows[0].setting_value;

    // Parse JSON safely
    if (typeof settings === "string") {
      try {
        settings = JSON.parse(settings);
      } catch (err) {
        console.error("Invalid JSON in setting_value:", err);
        return null;
      }
    }

    if (!settings || typeof settings !== "object") {
      return null;
    }

    let value = settings[key];

    if (value === undefined) {
      return null;
    }

    // Handle double-encoded JSON
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // ignore
      }
    }

    return value;
  }

  /**
   * Update a specific setting key (AUTO CREATE if not exists)
   */
  static async updateByKey(account_uuid, key, value) {
    const [rows] = await db.query(
      "SELECT setting_value FROM app_settings WHERE account_uuid = ? LIMIT 1",
      [account_uuid],
    );

    let settings = {};
    const exists = rows.length > 0;

    if (exists) {
      settings = rows[0].setting_value;

      if (typeof settings === "string") {
        try {
          settings = JSON.parse(settings);
        } catch (err) {
          console.error("Invalid JSON in DB:", err);
          settings = {};
        }
      }
    }

    if (!settings || typeof settings !== "object") {
      settings = {};
    }

    // Update key
    settings[key] = value;

    const stringified = JSON.stringify(settings);

    // INSERT or UPDATE
    if (exists) {
      await db.query(
        "UPDATE app_settings SET setting_value = ? WHERE account_uuid = ?",
        [stringified, account_uuid],
      );
    } else {
      await db.query(
        "INSERT INTO app_settings (account_uuid, setting_value) VALUES (?, ?)",
        [account_uuid, stringified],
      );
    }

    return true;
  }

  /**
   * Create a new settings record (manual use if needed)
   */
  static async create(account_uuid, initialSettings = {}) {
    try {
      const [rows] = await db.query(
        "SELECT account_uuid FROM app_settings WHERE account_uuid = ? LIMIT 1",
        [account_uuid]
      );

      if (rows.length) {
        return false;
      }

      if (!initialSettings || typeof initialSettings !== "object") {
        initialSettings = {};
      }

      await db.query(
        "INSERT INTO app_settings (account_uuid, setting_value) VALUES (?, ?)",
        [account_uuid, JSON.stringify(initialSettings)]
      );

      return true;
    } catch (err) {
      console.error("Error creating settings:", err);
      throw err;
    }
  }
}

module.exports = SettingsModel;