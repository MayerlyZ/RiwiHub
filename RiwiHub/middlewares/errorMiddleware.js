import { ValidationError } from 'sequelize';

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: err.errors.map(error => error.message),
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export default errorMiddleware;