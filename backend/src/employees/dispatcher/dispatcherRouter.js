const Router = require('express');
const { getRequests } = require('../../controllers/requestController');
const roleMiddleware = require('../../middlewares/roleMiddleware');

const router = new Router();

router.get('./requests', roleMiddleware('DISPATCHER'), getRequests);
module.exports = router;    