window.onload = () => {

  const socket = window.io();

  const btnMessage = document.querySelector('#btnMessage');
  const inputMessage = document.querySelector('#inputMessage');
  const btnNickname = document.querySelector('#btnNickname');
  const inputUser = document.querySelector('#inputNickname');

  btnNickname.addEventListener('click', (e) => {
    e.preventDefault();
    if (inputMessage.value) {
      // let nickname = inputUser.value;
      socket.emit('users', { nickname: inputUser.value, userID: socket.id });
      inputUser.value = '';
    }
    console.log(inputUser.value);
  }, false);

  btnMessage.addEventListener('click', (e) => {
    e.preventDefault();
    const currentDate = new Date();
    socket.emit('message', {
      timestamp: currentDate,
      nickname: inputUser.value,
      chatMessage: inputMessage.value,
    });
    console.log(inputMessage.value, currentDate);
    inputMessage.value = '';
  }, false);

  const createUser = (user) => {
    const ul = document.querySelector('#user');
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.setAttribute('id', user.userID);
    if (socket.id === user.userID) nickname = user.nickname;
    li.innerText = user.nickname;
    ul.appendChild(li);
  };

  const createMessage = (message) => {
    const ul = document.querySelector('#message');
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'message');
    li.innerText = message;
    ul.appendChild(li);
  };

  const updateUser = (newNickname) => {
    const li = document.getElementById(newNickname.userID);
    if (socket.id === newNickname.userID) nickname = newNickname.nickname;
    li.innerText = newNickname.nickname;
    socket.emit('newNickname', newNickname);
  };

  const deleteUser = (userId) => {
    const li = document.getElementById(userId);
    li.remove();
  };
  socket.on('users', (user) => createUser(user));
  socket.on('message', (message) => createMessage(message));
  socket.on('nickname', (newNickname) => updateUser(newNickname));
  socket.on('newConnection', (historic) => historic.forEach((message) => createMessage(message)));
  socket.on('userOnline', (userList) => {
    const i = userList.findIndex((list) => list.userID === socket.id);
    userList.splice(i, 1);
    userList.forEach((user) => createUser(user));
  });

  socket.on('userOff', (userId) => deleteUser(userId));
};
