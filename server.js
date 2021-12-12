const PORT = process.env.PORT || 3000;

const socketIO = require('socket.io');
const http = require('http');

const app = require('./app');

const server = http.createServer(app);

const io = socketIO(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'], 
} });

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});