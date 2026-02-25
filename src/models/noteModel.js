const db = require('../config/db');

exports.createNote = async (jobuuid, notes) => {
  const [result] = await db.query(
    'INSERT INTO job_notes (jobuuid, notes) VALUES (?, ?)',
    [jobuuid, notes]
  );
  return result;
};

exports.getAllNotes = async () => {
  const [rows] = await db.query('SELECT * FROM job_notes');
  return rows;
};

exports.getNoteById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM job_notes WHERE id = ?',
    [id]
  );
  return rows[0];
};

exports.updateNote = async (id, jobuuid, notes) => {
  const [result] = await db.query(
    'UPDATE job_notes SET jobuuid = ?, notes = ? WHERE id = ?',
    [jobuuid, notes, id]
  );
  return result;
};

exports.deleteNote = async (id) => {
  const [result] = await db.query(
    'DELETE FROM job_notes WHERE id = ?',
    [id]
  );
  return result;
};