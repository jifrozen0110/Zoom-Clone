const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
const myFace=document.getElementById("myFace");
const mute=document.getElementById("mute");
const camera=document.getElementById("camera");
const camerasSelect=document.getElementById("cameras")
const call=document.getElementById("call")

call.hidden=true

let myStream;
let muted=false;
let cameraOff=false;
let roomName;

async function getCameras(){
  try{
    const devices=await navigator.mediaDevices.enumerateDevices();
    const cameras=devices.filter((device) => device.kind =="videoinput")
    const currentCamera=myStream.getVideoTracks()[0]
    cameras.forEach((camera)=>{
      const option=document.createElement("option")
      option.value=camera.deviceId
      option.innerText=camera.label;
      if(currentCamera.label==camera.label){
        option.selected=true;
      }
    })
  }catch(e){
    console.log(e)
  }
}
async function getMedia(deviceId){
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try{
    myStream=await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    )
    myFace.srcObject=myStream;
    if(!deviceId){
    await getCameras()
    }
  }catch(e){
    console.log(e);
  }
}

function addMessage(message){
  const ul=room.querySelector("ul");
  const li=document.createElement("li")
  li.innerText=message;
  ul.appendChild(li);
}

function handleMessageSubmit(event){
  event.preventDefault()
  const input=room.querySelector("input")
  const value=input.value
  socket.emit("new_message",input.value,roomName, () =>{
    addMessage(`You : ${value}`)
  })
  input.value="";
}

function showRoom() {
  welcome.hidden = true;
  call.hidden=false
  getMedia()
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const form =room.querySelector("form")
  form.addEventListener("submit",handleMessageSubmit)
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = form.querySelector("#roomName");
  const nickNameInput = form.querySelector("#name");
  socket.emit('enter_room', roomNameInput.value,nickNameInput.value ,showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = '';
}

function handleMuteClick(){
  myStream.getAudioTracks().forEach((track)=>(track.enabled=!track.enabled))
  if(!muted){
    mute.innerText="Unmute"
    muted=true
  }
  else{
    mute.innerText="mute"
    muted=false;
  }
}

function handleCameraClick(){
  myStream.getVideoTracks().forEach((track)=>(track.enabled=!track.enabled))
  if(!cameraOff){
    camera.innerText="Trun Camera On"
    cameraOff=true
  }
  else{
    camera.innerText="Trun Camera Off"
    cameraOff=false;
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
}

form.addEventListener("submit",handleRoomSubmit)
mute.addEventListener("click",handleMuteClick)
camera.addEventListener("click",handleCameraClick)
camerasSelect.addEventListener("input", handleCameraChange);

socket.on("welcome",(user,newCount)=>{
  const h3 = room.querySelector("h3");
   h3.innerText = `Room ${roomName} (${newCount})`;
   addMessage(`${user} joined!`);
})

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left!`);
});

socket.on("new_message",addMessage)

socket.on("room_change",(rooms)=>{
  const roomList=welcome.querySelector("ul")
  rooms.forEach(room=>{
    const li=document.createElement("li")
    li.innerText=room
    roomList.append(li)
  })
})

