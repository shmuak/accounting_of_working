
const Router = require('express');
const {
  getRequestsAjaster,
  deleteRequestsAjaster,
} = require('../../controllers/requestsAjasterController');
const {
  getComplitedRequests,
  createComplitedRequest,
  
} = require('../../controllers/requestsComplitedController');
const roleMiddleware = require('../../middlewares/roleMiddleware'); 

const router = new Router();

// Маршруты для "RequestsAjaster" (обычные заявки наладчика)
router.get('/requests', roleMiddleware('ADJUSTER'), getRequestsAjaster);

router.delete('/requests/:id', roleMiddleware('ADJUSTER'), deleteRequestsAjaster);

// Маршруты для "ComplitedRequests" (выполненные заявки)
router.post('/complited', roleMiddleware('ADJUSTER'), createComplitedRequest);
router.get('/complited', roleMiddleware('ADJUSTER'), getComplitedRequests); 

module.exports = router;