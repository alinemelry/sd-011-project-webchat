const moment = require('moment');
const messagesModel = require('../models/messagesModel');

const users = [];

const newUser = (io, socket, name) => {
  users.unshift(name);
  socket.emit('users', users);
  users.shift(name);
  users.push(name);
  socket.emit('serverMessage', { message: `Bem vindo ${name}!`, name });
  socket.broadcast.emit('serverMessage', `${name} acabou de entrar!`);
  socket.broadcast.emit('users', users);
};

const renameUser = (io, socket, name, newNickname) => {
  users.splice(users.indexOf(name), 1);
  users.push(newNickname);
  socket.emit('serverMessage', { message: `Bem vindo ${newNickname}!`, name: newNickname });
  socket.broadcast.emit('serverMessage', `${name} alterado para ${newNickname}!`);
  io.emit('users', users);
};

module.exports = (io) => io.on('connection', (socket) => {
    let name = (socket.id).substr(4);

    newUser(io, socket, name);

    socket.on('serverMessage', (newNickname) => {
      renameUser(io, socket, name, newNickname);
      name = newNickname;
    });

    socket.on('message', async ({ chatMessage: message, nickname }) => {
      const timestamp = moment().format('DD-MM-YYYY h:mm:ss a');
      await messagesModel.create({ message, nickname, timestamp });
      io.emit('message', `${timestamp} - ${nickname}: ${message}`);
    });

    socket.on('disconnect', () => {
      users.splice(users.indexOf(name), 1);
      socket.broadcast.emit('serverMessage', `${name} deixou o chat.`);
      io.emit('users', users);
    });
  });