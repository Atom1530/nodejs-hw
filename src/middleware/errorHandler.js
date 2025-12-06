import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message || err.name,
    });
  }

  return res.status(500).json({
    message: err.message || 'Internal server error',
  });
};
