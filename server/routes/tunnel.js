const express = require('express');
const router = express.Router();

const tunnelController = require('../controllers').tunnel;

router.get('*', tunnelController.tunnel);

module.exports = router;
