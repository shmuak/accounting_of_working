const Router = require('express');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const {getConsumables} = require('../../controllers/consumableController');
const router = new Router();

router.get('/consumables', roleMiddleware('STOKEKEEPER'), getConsumables);
module.exports = router;