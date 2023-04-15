import { Request, Response, NextFunction } from 'express';
import { error } from '../helpers/response';

// eslint-disable-next-line no-unused-vars
function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err) {
    if (err.name === 'UnauthorizedError') {
      return error(res, err, 'User not authorized!', 401);
    }

    if (err.name === 'ValidationError') {
      return error(res, err, 'Validation Error!', 400);
    }

    if (err.name === 'TypeError') {
      return error(res, err, 'Error Occurred! There was a type error.', 406);
    }

    return error(res, err, 'Error Occurred! Unknown Error.', err.status || 500);
  }
}

export default errorHandler;
