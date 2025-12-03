import { Router } from 'express';
import notesRouter from './notesRoutes.js';

const router = Router();

router.use(notesRouter);

export default router;
