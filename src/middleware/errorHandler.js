import { HttpError } from 'http-errors';

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.name,
      error: err.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal server error',
    error: err.message,
  });
};
