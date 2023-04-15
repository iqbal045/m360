import { Router } from 'express';

import {
  create,
  destroy,
  index,
  show,
  update,
} from '../controllers/attribute.controller';

const router: Router = Router();

router.get('/', index);

router.post('/', create);

router.get('/:id', show);

router.patch('/:id', update);

router.delete('/:id', destroy);

export default router;
