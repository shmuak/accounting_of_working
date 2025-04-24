const Router = require('express');
const adminController = require('./adminController');
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = new Router();

router.get('/users', roleMiddleware('ADMIN'), adminController.getUsers);

module.exports = router;