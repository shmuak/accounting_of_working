const Router = require('express');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const {getRequestsMechanic} = require('../../controllers/requestsMechanicController');
const router = new Router();

router.get('/requests', roleMiddleware('MECHANIC'), getRequestsMechanic);
module.exports = router;