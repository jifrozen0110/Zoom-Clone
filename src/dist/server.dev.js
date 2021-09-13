"use strict";

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _socket = _interopRequireDefault(require("socket.io"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dirname = _path["default"].resolve();

var app = (0, _express["default"])();
app.set('view engine', 'pug');
app.set('views', _dirname + '/src/views');
app.use('/public', _express["default"]["static"](_dirname + '/src/public'));
app.get('/', function (_, res) {
  return res.render('home');
});
app.get('/*', function (_, res) {
  return res.redirect('/');
});

var server = _http["default"].createServer(app);

var wss = (0, _socket["default"])(server);

function publicRooms() {
  var _wsServer = wsServer,
      _wsServer$sockets$ada = _wsServer.sockets.adapter,
      sids = _wsServer$sockets$ada.sids,
      rooms = _wsServer$sockets$ada.rooms;
  var publicRooms = [];
  rooms.forEach(function (_, key) {
    if (sids.get(key) == undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

wss.on('connection', function (socket) {
  socket.onAny(function (event) {
    console.log("Socket Event : ".concat(event));
  });
  socket.on('enter_room', function (roomName, done) {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", function () {
    socket.rooms.forEach(function (room) {
      return socket.to(room).emit("bye");
    });
  });
  socket.on("new_message", function (msg, room, done) {
    socket.to(room).emit("new_message", msg);
    done();
  });
});

var handleListen = function handleListen() {
  return console.log("Listening on http://localhost:3000");
};

server.listen(3000, handleListen);