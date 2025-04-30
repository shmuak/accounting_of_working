const express = require('express');
const { check } = require('express-validator');
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const {registration} = require('../auth/authController');
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();
router.get('/', roleMiddleware("ADMIN"), getUsers);         // GET /users
router.post(
    '/',
    [
      check('login', 'Логин не может быть пустым').notEmpty(),
      check('password', 'Пароль должен быть от 4 до 12 символов').isLength({ min: 4, max: 12 }),
      check('role', 'Роль обязательна').notEmpty()
    ], 
    roleMiddleware("ADMIN"),
    registration
  );
router.patch('/:id', roleMiddleware("ADMIN"), updateUser);                           // PATCH /users/:id
router.delete('/:id', roleMiddleware("ADMIN"), deleteUser);                          // DELETE /users/:id


module.exports = router;
