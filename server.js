const express = require('express');
const path = require('path');
const http = require('http'); // para poder enviar arquivos html

const app = express();
const server = http.createServer(app);

const PORT = 3000;

const io = require('socket.io')(server, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./sockets/webChat')(io);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

server.listen(PORT, () => console.log(`Escutando na porta: ${PORT}`));
