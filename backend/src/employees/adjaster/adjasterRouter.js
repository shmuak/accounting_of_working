const Router = require('express');

const router = new Router();

router.post('/create-request', roleMiddleware('MASTER'), createRequest);
module.exports = router;