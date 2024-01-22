import io from "socket.io-client";

const socket = io.connect("http://localhost:5002", {
  path: `/socket.io/socket.io.js`,
  transports: ["websocket"], 
});


export default socket;