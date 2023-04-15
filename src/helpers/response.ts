import { Response } from 'express';

interface ErrorData {
  _error: string;
  _message: string;
}

// Success response
export const success = (
  res: Response,
  data: any,
  message: string,
  status?: number,
): void => {
  res.status(status || 200).json({
    message,
    success: true,
    status: status || 200,
    data,
  });
};

// Error response
export const error = (
  res: Response,
  err: any,
  message: string,
  status?: number,
): void => {
  const errorData: ErrorData = {
    _error: err.name,
    _message: err.message,
  };
  res.status(status || 500).json({
    message,
    success: false,
    status: status || 500,
    error: err.message,
  });
};
