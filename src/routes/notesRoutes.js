//src/routes/notesRoutes.js

import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getAllNotes,
  getNoteById,
  deleteNote,
  createNote,
  updateNote,
} from '../controllers/notesController.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

import { authenticate } from '../middleware/authenticate.js';

const notesRouter = Router();

notesRouter.use('/notes', authenticate);

notesRouter.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

notesRouter.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

notesRouter.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

notesRouter.post('/notes', celebrate(createNoteSchema), createNote);

notesRouter.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default notesRouter;
