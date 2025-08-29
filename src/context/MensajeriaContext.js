import { createContext } from "react";

const MensajeriaContext = createContext({
  ping: undefined,
  historyInfo: () => null,
  verHistorial: () => null,
});

export default MensajeriaContext;