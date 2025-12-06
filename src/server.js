// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errors } from 'celebrate';

import { getEnvVar } from './helper/getEnvVar.js';
import { ENV_VARS } from './constants/envVars.js';

import { connectMongoDB } from './db/connectMongoDB.js';
import { setupLogger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';

const app = express();

// ===== middleware =====
app.use(setupLogger());
app.use(cors());
app.use(express.json());

// ===== роути нотаток  =====
app.use(notesRouter);

// GET /test-error
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// ✅ обработка ошибок валидации celebrate
app.use(errors());

// ===== middleware для 404 =====
app.use(notFoundHandler);

// ===== middleware для 500 =====
app.use(errorHandlerMiddleware);

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
