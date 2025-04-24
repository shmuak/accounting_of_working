const Router = require('express');
const authController = require('./authController');
const {check} = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");

const router = new Router();

router.post('/registration', [
    check("login", "Логин не может быть пустым").notEmpty(),
    check("password","Пароль должен быть больше 6 символов").isLength({min:6})
], authController.registration);

router.post('/login', authController.login);

module.exports = router;