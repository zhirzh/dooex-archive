import express from 'express';

import { meta, show, showAll, slice, stream } from '@/controllers/doodles';

const router = express.Router();

router.get('/all', showAll);
router.get('/meta', meta);
router.get('/slice/:offset/:sliceSize', slice);
router.get('/:doodleId', show);

export default router;
