const noteModel = require('../models/noteModel');

exports.create = async (req, res) => {
  try {
    const { jobuuid, notes } = req.body;

    if (!jobuuid || !notes) {
      return res.status(400).json({ message: 'jobuuid and notes are required' });
    }

    const result = await noteModel.createNote(jobuuid, notes);

    res.status(201).json({
      id: result.insertId,
      jobuuid,
      notes
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const notes = await noteModel.getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const note = await noteModel.getNoteById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { jobuuid, notes } = req.body;

    const result = await noteModel.updateNote(
      req.params.id,
      jobuuid,
      notes
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note updated successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await noteModel.deleteNote(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};