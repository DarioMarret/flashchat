import { GetTokenDecoded } from "function/storeUsuario";
import { host, proxy } from "function/util/global";
import io from "socket.io-client";



const socket = io.connect(String(host()).replace(`/${proxy}/`, ""), {
  path: `/${proxy}/socket.io/socket.io.js`,
  transports: ["websocket"],
  query: {
    sessionId: GetTokenDecoded() ? GetTokenDecoded().id : null,
  }
})

export default socket;