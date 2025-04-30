const Router = require('express');
const adminController = require('./adminController');
const roleMiddleware = require("../middlewares/roleMiddleware");
const {getWorkshops} = require("../controllers/workshopController")

const router = new Router();

router.get('/users', roleMiddleware('ADMIN'), adminController.getUsers);

router.get('/workshops', roleMiddleware('ADMIN'), getWorkshops);
module.exports = router;