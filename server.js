const express = require('express');
const path = require('path');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);
  
  socket.on('message', (data) => {
    io.emit('message', data);
  });
});

app.use('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});