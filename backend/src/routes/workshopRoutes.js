const express = require('express');
const { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } = require('../controllers/workshopController');

const router = express.Router();

router.get('/', getWorkshops);
router.post('/', createWorkshop);
router.patch('/:id', updateWorkshop);
router.delete('/:id', deleteWorkshop);

module.exports = router;