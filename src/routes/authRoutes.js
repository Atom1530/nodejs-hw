// src/routes/authRoutes.js

import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUser,
  refreshUserSession,
  registerUser,
  logoutUser,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const authRouter = Router();

authRouter.post('/auth/register', celebrate(registerUserSchema), registerUser);
authRouter.post('/auth/login', celebrate(loginUserSchema), loginUser);
authRouter.post('/auth/logout', logoutUser);
authRouter.post('/auth/refresh', refreshUserSession);

export default authRouter;
