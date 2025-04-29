const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { setupPing } = require('./socketManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

setupPing(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
