// src/controllers/notesController.js
import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);
    const skip = (pageNumber - 1) * perPageNumber;

    const userId = req.user._id; // нотатки тільки поточного користувача

    // базовый запрос: только свои нотатки
    const notesQuery = Note.find({ userId });

    if (tag) {
      notesQuery.where('tag').equals(tag);
    }

    if (search && search.trim()) {
      notesQuery.where({ $text: { $search: search.trim() } });
    }

    const [totalNotes, notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery.skip(skip).limit(perPageNumber),
    ]);

    const totalPages = Math.ceil(totalNotes / perPageNumber);

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
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
    const userId = req.user._id;

    // шукємо нотатку по id, яка належить поточному користувачу
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const note = await Note.create({
      ...req.body,
      userId, // прив’язуємо до поточного користувача
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId }, // оновлюємо тільки свою нотатку
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
