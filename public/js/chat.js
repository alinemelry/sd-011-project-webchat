const socket = window.io('http://localhost:3000');

const DATA_TEST_ID = 'data-testid';

console.log(window);
const innitialNickLi = document.querySelector('#currNickName');
let userName = innitialNickLi.innerText;

socket.emit('userConnect', userName);

const formSendMSg = document.querySelector('#msgForm');
const inputMsg = document.querySelector('#msgInput');
formSendMSg.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', {
    chatMessage: inputMsg.value,
    nickname: userName || socket.id,
  });
  return false;
});

const createMessage = (message) => {
  const chatUl = document.querySelector('#chatUl');
  const commentLi = document.createElement('li');
  commentLi.innerText = message;
  commentLi.setAttribute(DATA_TEST_ID, 'message');
  chatUl.appendChild(commentLi);
};

const getAllMessages = async () => {
  const savedMessages = await fetch('http://localhost:3000/message')
    .then((r) => r.json());
  console.log(savedMessages);
  savedMessages.forEach((msg) => createMessage(`${msg.timestamp} ${msg.nickname} ${msg.message}`));
};

const attUserList = (userList) => {
  const usersUl = document.querySelector('#usersUl');
  usersUl.innerHTML = '';
  const currUserLi = document.createElement('li');
  currUserLi.innerText = userName;
  currUserLi.id = 'currNickName';
  currUserLi.setAttribute(DATA_TEST_ID, 'online-user');
  usersUl.appendChild(currUserLi);
  userList.forEach((user) => {
    if (user !== userName) {
      const userLi = document.createElement('li');
      userLi.innerText = user;
      userLi.setAttribute(DATA_TEST_ID, 'online-user');
      usersUl.appendChild(userLi);
    }
  });
};

socket.on('message', (message) => createMessage(message));
socket.on('attList', (userList) => attUserList(userList));
socket.on('loadMessages', (messages) => messages.forEach((msg) => {
  console.log('Opa');
  createMessage(`${msg.timestamp} ${msg.nickname} ${msg.message}`);
}));

const formUserName = document.querySelector('#userForm');
const inputUserName = document.querySelector('#userInput');
formUserName.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('userUpdate', {
    oldNick: innitialNickLi.innerText,
    newNick: inputUserName.value,
  });
  innitialNickLi.innerText = inputUserName.value;
  userName = inputUserName.value;
});

window.onload = (async () => {
  await getAllMessages();
});