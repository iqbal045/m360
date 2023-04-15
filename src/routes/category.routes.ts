import { Router } from 'express';
import {
  create,
  destroy,
  index,
  show,
  status,
  update,
} from '../controllers/category.controller';

const router: Router = Router();

router.get('/', index);

router.post('/', create);

router.get('/:id', show);

router.patch('/:id', update);

router.delete('/:id', destroy);

router.get('/:id/status', status);

export default router;
