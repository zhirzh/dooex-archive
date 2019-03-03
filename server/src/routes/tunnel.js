import express from 'express';

import { tunnel } from '@/controllers/tunnel';

const router = express.Router();

router.get('*', tunnel);

export default router;
