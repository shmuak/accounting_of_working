const Router = require('express');
const {createRequest} = require('../../controllers/requestController');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const router = new Router();

router.post('/create-request', roleMiddleware('MASTER'), createRequest);
module.exports = router;