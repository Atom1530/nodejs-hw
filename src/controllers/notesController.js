// controllers/notesController.js';

import createHttpError from 'http-errors';
import { Notes } from '../models/notes.js';

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

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Notes.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Notes.create(req.body);
  res.status(201).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Notes.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};
