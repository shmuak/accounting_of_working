const express = require('express');
const { getRequestsMechanic, createRequestsMechanic, updateRequestsMechanic, deleteRequestsMechanic } = require('../controllers/requestsMechanicController');

const router = express.Router();

router.get('/', getRequestsMechanic);
router.post('/', createRequestsMechanic);
router.patch('/:id', updateRequestsMechanic);
router.delete('/:id', deleteRequestsMechanic);

module.exports = router;