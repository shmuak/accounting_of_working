const Router = require('express');
const {createRequest} = require('../../controllers/requestController');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const {getEquipments} = require('../../controllers/equipmentController');
const router = new Router();

router.post('/create-request', roleMiddleware('MASTER'), createRequest);
router.get('/', getEquipments);
module.exports = router;