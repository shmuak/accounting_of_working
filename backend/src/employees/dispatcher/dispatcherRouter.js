const Router = require('express');
const { getRequests } = require('../../controllers/requestController');
const { getUsers} = require('../../controllers/userController')
const roleMiddleware = require('../../middlewares/roleMiddleware');
const { getWorkshops } = require('../../controllers/workshopController');
const { getRequestsMechanic } = require('../../controllers/requestsMechanicController');
 
const router = new Router();

router.get('/requests', roleMiddleware('DISPATCHER'), getRequests);
router.get('/mechanics', roleMiddleware('DISPATCHER'), getUsers);
router.get('/workshops', roleMiddleware('DISPATCHER'), getWorkshops)
router.get('/requests-mechanic', roleMiddleware('DISPATCHER'), getRequestsMechanic)
module.exports = router;    