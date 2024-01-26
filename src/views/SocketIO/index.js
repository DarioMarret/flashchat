import io from "socket.io-client";

const socket = io.connect("http://177.234.209.101:5002", {
  path: `/socket.io/socket.io.js`,
  transports: ["websocket"], 
});


export default socket;