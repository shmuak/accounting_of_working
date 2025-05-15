const Router = require('express');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const {getRequestsMechanic, completeRequestMechanic} = require('../../controllers/requestsMechanicController');
const {getConsumables, } = require('../../controllers/consumableController');
const { createRequestsStokekeeper, getRequestsStokekeeperByMaster, createManualConsumableRequest,  } = require('../../controllers/RequestsStokekeeperController');
const { createAjasterRequest } = require('../../controllers/requestsAjasterController');
const router = new Router();

router.get('/requests', roleMiddleware('MECHANIC'), getRequestsMechanic);
router.get('/warehouse', roleMiddleware('MECHANIC'), getConsumables)
router.post('/request-stokekeeper', roleMiddleware('MECHANIC'), createRequestsStokekeeper);
router.get('/consumable-requests', roleMiddleware('MECHANIC'), getRequestsStokekeeperByMaster);
router.post('/manual-consumable-request', roleMiddleware('MECHANIC'), createManualConsumableRequest);
router.post('/create-ajaster-request', createAjasterRequest);
router.patch('/request-mechanic/:id/complete',completeRequestMechanic);

module.exports = router;