const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h2');
  h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.getElementById('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}
