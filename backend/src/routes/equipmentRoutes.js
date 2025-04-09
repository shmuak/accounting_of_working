const express = require('express');
const { getEquipments, createEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipmentController');

const router = express.Router();

router.get('/', getEquipments);
router.post('/', createEquipment);
router.patch('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

module.exports = router;