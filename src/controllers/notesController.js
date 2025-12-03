// controllers/notesController.js';

import createHttpError from 'http-errors';
import { Notes } from '../db/models/notes.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Notes.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Notes.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
