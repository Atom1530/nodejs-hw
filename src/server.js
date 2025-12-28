// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { getEnvVar } from './helper/getEnvVar.js';
import { ENV_VARS } from './constants/envVars.js';

import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRouter from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { logger } from './middleware/logger.js';

const app = express();

// ===== middleware =====
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ===== роуты =====
app.use(notesRouter);
app.use(authRoutes);
app.use(userRoutes);

// GET /test-error
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// ===== 404 =====
app.use(notFoundHandler);

// ✅ celebrate errors AFTER 404
app.use(errors());

// ===== общий обработчик ошибок =====
app.use(errorHandler);

// ===== запуск сервера =====
const PORT = getEnvVar(ENV_VARS.PORT, 3000);

const startServer = async () => {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
