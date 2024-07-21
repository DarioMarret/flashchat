import { host, proxy } from "function/util/global";
import io from "socket.io-client";

const socket = io.connect(String(host()).replace(`/${proxy}/`, ""), {
    path: `/${proxy}/socket.io/socket.io.js`,
    transports: ["websocket"],
  });

export default socket;