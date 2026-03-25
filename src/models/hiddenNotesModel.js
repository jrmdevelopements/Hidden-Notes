const db = require('../config/db');

exports.create = async (account_uuid, data) => {
  const [result] = await db.query(
    'INSERT INTO hidden_notes (account_uuid, jobuuid, notes) VALUES (?, ?, ?)',
    [account_uuid, data.jobuuid, data.notes]
  );
  return result;
};

exports.findAll = async (account_uuid, pagination) => {
  const [rows] = await db.query(
    'SELECT * FROM hidden_notes WHERE account_uuid = ? LIMIT ? OFFSET ?',
    [account_uuid, pagination.limit, pagination.offset]
  );
  return rows;
};

exports.findById = async (account_uuid, id) => {
  const [rows] = await db.query(
    'SELECT * FROM hidden_notes WHERE account_uuid = ? AND id = ?',
    [account_uuid, id]
  );
  return rows[0];
};

exports.findByJobuuid = async (account_uuid, jobuuid) => {
  const [rows] = await db.query(
    'SELECT * FROM hidden_notes WHERE account_uuid = ? AND jobuuid = ?',
    [account_uuid, jobuuid]
  );
  return rows[0];
};

exports.update = async (account_uuid, id, data) => {
  const [result] = await db.query(
    'UPDATE hidden_notes SET jobuuid = ?, notes = ? WHERE account_uuid = ? AND id = ?',
    [data.jobuuid, data.notes, account_uuid, id]
  );
  return result;
};

exports.delete = async (account_uuid, id) => {
  const [result] = await db.query(
    'DELETE FROM hidden_notes WHERE account_uuid = ? AND id = ?',
    [account_uuid, id]
  );
  return result;
};