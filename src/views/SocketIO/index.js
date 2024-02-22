import { dev, host, proxy } from "function/util/global";
import io from "socket.io-client";

var socket = null
if(dev){
  socket = io.connect("http://localhost:5002", {
    path: "/socket.io/socket.io.js",
    transports: ["websocket"],
  });
}else{
  socket = io.connect(String(host).replace(`/${proxy}/`, ""), {
    path: `/${proxy}/socket.io/socket.io.js`,
    transports: ["websocket"],
  });
}

export default socket;