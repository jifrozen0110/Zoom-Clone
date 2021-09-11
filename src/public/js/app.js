const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');
const socket = new WebSocket(`ws://${window.location.host}`);
function handleOpen() {
  console.log('Connected to Server');
}

socket.addEventListener('open', handleOpen);

socket.addEventListener('message', (message) => {
  console.log('Disconnected from Server');
});

function handelSubmit(event) {
  event.preventDefault();
  const input = messageFrom.querySelector('input');
  socket.send(input.value);
  input.value = '';
}

messageForm.addEventListener('submit', handleSubmit);
