import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import path from 'path';

const __dirname = path.resolve();
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/src/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function onSocketClase() {
  console.lo('Disconnected from the Browser');
}

const sockets = [];

wss.on('connection', (socket) => {
  sockets.push(socket);
  socket.on('close', onSocketClose);
  socket.on('message', (message) => {
    sockets.forEach((asocket) => asocket.send(message));
  });
});

server.handleListen(3000, handleListen);
