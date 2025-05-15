const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const requestRouters = require('./routes/requestRoutes');
const workshopRouters = require('./routes/workshopRoutes');
const equipmentRouters = require('./routes/equipmentRoutes');
const consumableRoutes = require('./routes/consumableRoutes');
const reportRouter = require('./routes/reportRoutes');
const authRouter = require('./auth/authRouter');
const adminRouter = require('./employees/admin/adminRouter');
const roleRouter = require('./routes/roleRouters');
const masterRouter = require('./employees/master/masterRouter');
const requestsMechanicRouters = require('./routes/requestsMechanicRouters');
const requestsStokekeeperRouter = require('./routes/requestsStokekeeperRouter')
const dispatcherRouter = require('./employees/dispatcher/dispatcherRouter');
const mechanicRouter = require('./employees/mechanic/mechanicRouter');
const stokekeeperRouter = require('./employees/stokekeeper/stokekeeperRoute');
const errorHandler = require('./utils/errorHandler');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true     
}))
app.use(morgan('dev'));

app.use('/auth', authRouter);

app.use('/requests', requestRouters);
app.use('/request-mechanic', requestsMechanicRouters);
app.use('/request-stokekeeper', requestsStokekeeperRouter)
app.use('/workshops', workshopRouters);
app.use('/equipments', equipmentRouters);
app.use('/consumables', consumableRoutes);
app.use('/reports', reportRouter );
app.use('/roles', roleRouter);

app.use('/admin', adminRouter);
app.use('/users', userRoutes);
app.use('/master', masterRouter);
app.use('/dispatcher', dispatcherRouter);
app.use('/mechanic', mechanicRouter);
app.use('/stokekeeper', stokekeeperRouter)
app.use(errorHandler);

module.exports = app;