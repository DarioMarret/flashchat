import { GetTokenDecoded } from "function/storeUsuario";
import { host, proxy } from "function/util/global";
import io from "socket.io-client";


var socket;
if(GetTokenDecoded() === null){
  socket = io.connect(String(host()).replace(`/${proxy}/`, ""), {
      path: `/${proxy}/socket.io/socket.io.js`,
      transports: ["websocket"],
      query: {
        sessionId: GetTokenDecoded() ? GetTokenDecoded().id : null,
      }
  });
}else{
  socket = null;
}

export default socket;