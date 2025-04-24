const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const requestRouters = require('./routes/requestRoutes');
const workshopRouters = require('./routes/workshopRoutes');
const equipmentRouters = require('./routes/equipmentRoutes');
const consumableRoutes = require('./routes/consumableRoutes');
const reportRouter = require('./routes/reportRoutes');
const authRouter = require('./auth/authRouter');
const adminRouter = require('./admin/adminRouter');
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
app.use('/users', userRoutes);
app.use('/requests', requestRouters);
app.use('/workshops', workshopRouters);
app.use('/equipments', equipmentRouters);
app.use('/consumables', consumableRoutes);
app.use('/reports', reportRouter );
app.use('/admin', adminRouter)
app.use(errorHandler);

module.exports = app;