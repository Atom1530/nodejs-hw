// src/routes/notesRoutes.js
import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  deleteNote,
  createNote,
  updateNote,
} from '../controllers/notesController.js';

const notesRouter = Router();

notesRouter.get('/notes', getAllNotes);
notesRouter.post('/notes', createNote);

notesRouter.get('/notes/:noteId', getNoteById);

notesRouter.delete('/notes/:noteId', deleteNote);

notesRouter.patch('/notes/:noteId', updateNote);

export default notesRouter;
