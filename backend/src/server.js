require('dotenv').config();
const http = require('http');

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// DB
connectDB();

// Server
const server = http.createServer(app);

// initialize sockets
const socketLib = require('./sockets/socket');
socketLib.init(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
