require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');


const port = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);
server.listen(port, () => console.log(`🚀 Server running on port ${port}`));