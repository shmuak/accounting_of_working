const express = require('express');
const { getRequests, createRequest, updateRequest, deleteRequest } = require('../controllers/requestController');

const router = express.Router();

router.get('/', getRequests);
router.post('/', createRequest);
router.patch('/:id', updateRequest);
router.delete('/:id', deleteRequest);

module.exports = router;