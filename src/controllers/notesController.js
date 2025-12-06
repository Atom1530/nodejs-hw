// controllers/notesController.js

import createHttpError from 'http-errors';
import { Notes } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search, page = 1, perPage = 10 } = req.query;

    const pageNum = Number(page) || 1;
    const perPageNum = Number(perPage) || 10;
    const skip = (pageNum - 1) * perPageNum;

    const notesQuery = Notes.find();

    if (tag) {
      notesQuery.where('tag').equals(tag);
    }

    if (search) {
      notesQuery.where({ $text: { $search: search } });
    }

    const [totalNotes, notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery.clone().skip(skip).limit(perPageNum),
    ]);

    const totalPages = Math.ceil(totalNotes / perPageNum);

    res.status(200).json({
      page: pageNum,
      perPage: perPageNum,
      totalNotes,
      totalPages,
      notes,
    });
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
