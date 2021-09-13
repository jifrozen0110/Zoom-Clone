"use strict";

var socket = io();
var welcome = document.getElementById('welcome');
var form = welcome.querySelector('form');
var room = document.getElementById('room');
room.hidden = true;
var roomName;

function addMessage(message) {
  var ul = room.querySelector("ul");
  var li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  var input = room.querySelector("input");
  var value = input.value;
  socket.emit("new_message", input.value, roomName, function () {
    addMessage("You : ".concat(value));
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  var h3 = room.querySelector('h3');
  h3.innerText = "Room ".concat(roomName);
  var form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  var roomNameInput = form.querySelector("#roomName");
  var nickNameInput = form.querySelector("#name");
  socket.emit('enter_room', roomNameInput.value, nickNameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = '';
}

form.addEventListener("submit", handleRoomSubmit);
socket.on("welcome", function (user, newCount) {
  var h3 = room.querySelector("h3");
  h3.innerText = "Room ".concat(roomName, " (").concat(newCount, ")");
  addMessage("".concat(user, " joined!"));
});
socket.on("bye", function (left, newCount) {
  var h3 = room.querySelector("h3");
  h3.innerText = "Room ".concat(roomName, " (").concat(newCount, ")");
  addMessage("".concat(left, " left!"));
});
socket.on("new_message", addMessage);
socket.on("room_change", function (rooms) {
  var roomList = welcome.querySelector("ul");
  rooms.forEach(function (room) {
    var li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});