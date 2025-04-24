const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get('/users', roleMiddleware("ADMIN"),getUsers);
router.post('/create-user', createUser);
router.patch('update-user/:id', updateUser);
router.delete('delete-user/:id', deleteUser);

module.exports = router;
