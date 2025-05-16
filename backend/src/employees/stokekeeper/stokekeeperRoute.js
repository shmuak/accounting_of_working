const Router = require('express');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const {getConsumables} = require('../../controllers/consumableController');
const { getRequestsStokekeeper } = require('../../controllers/RequestsStokekeeperController')
const router = new Router();

router.get('/consumables', roleMiddleware('STOKEKEEPER'), getConsumables);
router.get('/requests', roleMiddleware('STOKEKEEPER'), getRequestsStokekeeper)
module.exports = router;