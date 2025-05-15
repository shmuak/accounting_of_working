const express = require('express');
const { 
  getRequestsStokekeeper, 
  createRequestsStokekeeper, 
  updateRequestsStokekeeper, 
  deleteRequestsStokekeeper 
} = require('../controllers/RequestsStokekeeperController');

const router = express.Router();

router.get('/', getRequestsStokekeeper);
router.post('/', createRequestsStokekeeper);
router.patch('/:id', updateRequestsStokekeeper);
router.delete('/:id', deleteRequestsStokekeeper);

module.exports = router;