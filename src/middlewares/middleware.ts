import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const middleware = [
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(`uploads`),
  morgan('dev'),
];

const applyMiddleware = (app: any) => {
  middleware.forEach(m => {
    app.use(m);
  });
};

export default applyMiddleware;
