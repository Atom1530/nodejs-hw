//src/routes/index.js
import { Router } from 'express';
import notesRouter from './notesRoutes.js';
import authRouter from './authRoutes.js';

const router = Router();

router.use(notesRouter);
router.use(authRouter);

export default router;
