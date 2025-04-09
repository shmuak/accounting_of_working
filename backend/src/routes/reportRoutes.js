const express = require('express');
const { getReports, createReport, updateReport, deleteReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/', getReports);
router.post('/', createReport);
router.patch('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;