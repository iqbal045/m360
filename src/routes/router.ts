import { Request, Response } from 'express';
import categoryRoutes from './category.routes';
import attributeRoutes from './attribute.routes';
import attributeValueRoutes from './attributeValue.routes';
import productRoutes from './product.routes';

const routes = [
  // category Routes
  {
    path: `/categories`,
    handler: categoryRoutes,
  },

  // attribute Routes
  {
    path: `/attributes`,
    handler: attributeRoutes,
  },

  // attributeValue Routes
  {
    path: `/attr-values`,
    handler: attributeValueRoutes,
  },

  // product Routes
  {
    path: `/products`,
    handler: productRoutes,
  },

  // 404 Routes
  {
    path: '/*', // 404 response path
    handler: (req: Request, res: Response) => {
      res.status(404).json({
        message: `Error: 404, Url Not Found!`,
        success: false,
        status: 404,
      });
    },
  },
];

const appRouter = (app: any) => {
  routes.forEach(r => {
    if (r.path === '/') {
      app.get(r.path, r.handler);
    } else {
      app.use(r.path, r.handler);
    }
  });
};

export default appRouter;
