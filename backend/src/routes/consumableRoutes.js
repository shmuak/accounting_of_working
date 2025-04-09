const express = require('express');
const { getConsumables, createConsumable, updateConsumable, deleteConsumable } = require('../controllers/consumableController');

const router = express.Router();

router.get('/', getConsumables);
router.post('/', createConsumable);
router.patch('/:id', updateConsumable);
router.delete('/:id', deleteConsumable);

module.exports = router; 