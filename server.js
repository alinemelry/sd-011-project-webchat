const express = require('express');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
  },
});

const { getChatHistory } = require('./controllers/chatController');

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(express.static(`${__dirname}/public`));

require('./sockets/messages')(io);

app.get('/', getChatHistory);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});