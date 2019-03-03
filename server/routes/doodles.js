const express = require('express');
const router = express.Router();

const doodlesController = require('../controllers').doodles;

router.get('/data', doodlesController.data);
router.get('/data-:sliceSize', doodlesController.data);
router.get('/meta', doodlesController.metaData);

module.exports = router;
