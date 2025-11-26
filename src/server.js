// src/server.js
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import 'dotenv/config';
import { getEnvVar } from './helper/getEnvVar';
import { ENV_VARS } from './constants/envVars';

const app = express();

// ===== middleware =====

app.use(pinoHttp());

app.use(cors());

app.use(express.json());

// GET /notes
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// GET /notes/:noteId
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// GET /test-error
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// ===== middleware для 404 =====

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// ===== middleware для помилок 500 =====

app.use((err, req, res, next) => {
  if (req.log) {
    req.log.error(err);
  }

  res.status(500).json({
    message: err.message ?? 'Internal server error',
  });
});

// ===== запуск сервера =====

const PORT = getEnvVar(ENV_VARS.PORT, 3000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
