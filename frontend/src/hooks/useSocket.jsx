import { useContext } from "react";

import SocketContext from "../contexts/socket.jsx";

const useSocket = () => useContext(SocketContext);

export default useSocket;