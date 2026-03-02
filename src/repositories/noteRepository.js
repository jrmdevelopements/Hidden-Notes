const db = require('../config/db');

exports.create = async (data) => {
  const [result] = await db.query(
    'INSERT INTO job_notes (jobuuid, notes) VALUES (?, ?)',
    [data.jobuuid, data.notes]
  );
  return result;
};

exports.findAll = async (pagination) => {
  const [rows] = await db.query(
    'SELECT * FROM job_notes LIMIT ? OFFSET ?',
    [pagination.limit, pagination.offset]
  );
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM job_notes WHERE id = ?',
    [id]
  );
  return rows[0];
};

exports.findByjobuuid = async (jobuuid) => {
    
  const [rows] = await db.query(
    'SELECT * FROM job_notes WHERE jobuuid = ?',
    [jobuuid]
  );
  return rows[0];
  
};





exports.update = async (id, data) => {
  const [result] = await db.query(
    'UPDATE job_notes SET jobuuid = ?, notes = ? WHERE id = ?',
    [data.jobuuid, data.notes, id]
  );
  return result;
};

exports.delete = async (id) => {
  const [result] = await db.query(
    'DELETE FROM job_notes WHERE id = ?',
    [id]
  );
  return result;
};