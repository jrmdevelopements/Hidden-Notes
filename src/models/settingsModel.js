const db = require("../config/db");

class SettingsModel {
  /**
   * Get roles (always returns array)
   */
  static async get(account_uuid) {
    const [rows] = await db.query(
      "SELECT roles FROM permissions WHERE account_uuid = ? LIMIT 1",
      [account_uuid],
    );

    if (!rows.length) return [];

    let roles = rows[0];

    // Parse JSON safely
    if (typeof roles === "string") {
      try {
        roles = JSON.parse(roles);
      } catch (err) {
        console.error("Invalid JSON in roles:", err);
        return [];
      }
    }

    // Ensure array
    if (!Array.isArray(roles)) {
      return [];
    }

    return roles;
  }

  /**
   * Create roles (INSERT ONLY)
   */
  static async create(account_uuid, roles = []) {
    try {
      const [rows] = await db.query(
        "SELECT account_uuid FROM permissions WHERE account_uuid = ? LIMIT 1",
        [account_uuid]
      );

      if (rows.length) {
        throw new Error("Roles already exist for this account");
      }

      if (!Array.isArray(roles)) {
        throw new Error("Roles must be an array");
      }

      await db.query(
        "INSERT INTO permissions (account_uuid, roles) VALUES (?, ?)",
        [account_uuid, JSON.stringify(roles)]
      );

      return true;
    } catch (err) {
      console.error("Error creating roles:", err);
      throw err;
    }
  }

  /**
   * Update roles (UPDATE ONLY)
   */
  static async update(account_uuid, roles = []) {
    if (!Array.isArray(roles)) {
      throw new Error("Roles must be an array");
    }

    const [rows] = await db.query(
      "SELECT account_uuid FROM permissions WHERE account_uuid = ? LIMIT 1",
      [account_uuid],
    );

    if (!rows.length) {
      throw new Error("Roles not found for this account");
    }

    await db.query(
      "UPDATE permissions SET roles = ? WHERE account_uuid = ?",
      [JSON.stringify(roles), account_uuid],
    );

    return true;
  }
}

module.exports = SettingsModel;