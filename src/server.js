import http from 'http';
import express from 'express';
import { Server } from "socket.io";
import path from 'path';

const __dirname = path.resolve();
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/src/views');
app.use('/public', express.static(__dirname + '/src/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/video', (_, res) => res.render('video'));
app.get('/*', (_, res) => res.redirect('/'));

const server = http.createServer(app);
const wss = new Server(server);

function publicRooms(){
  const{
    sockets:{
      adapter:{sids,rooms},
    },
  }=wss;
  const publicRooms=[]
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms
}

function countRoom(roomName){
  return wss.sockets.adapter.rooms.get(roomName)?.size;
}
wss.on('connection', (socket) => {
  socket["nickname"]="Anon";
  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`);
  });
  socket.on('enter_room', (roomName,nickname, done) => {
    socket["nickname"] = nickname;
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome",socket.nickname,countRoom(roomName));
    wss.sockets.emit("room_change",publicRooms())
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye",socket.nickname,countRoom(room)-1));
  });
  socket.on("disconnect",()=>{
    wss.sockets.emit("room_change",publicRooms())
  })
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname",(nickname)=>(socket["nickname"]=nickname))
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
server.listen(3000, handleListen);
