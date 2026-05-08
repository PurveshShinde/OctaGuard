const express = require('express');
const scansController = require('../controllers/scans.controller');

const router = express.Router();

router.post('/', scansController.submitScan);
router.get('/', scansController.getScans);
router.get('/:id', scansController.getScanDetails);

module.exports = router;
