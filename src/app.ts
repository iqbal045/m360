import express, { Express } from 'express';

import appMiddleware from './middlewares/middleware'; // Middleware
import appRouter from './routes/router'; // Router
import errorHandler from './middlewares/errorHandler';

// Server
const app: Express = express();

// Middleware
appMiddleware(app);

// // Router
appRouter(app);

// Error Handler
app.use(errorHandler);

export default app;
