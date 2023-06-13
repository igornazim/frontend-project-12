import App from './App';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import SocketContext from "./contexts/socket.jsx";
import { io } from "socket.io-client";

const init = () => {
  const socket = io();

  return (
    <Provider store={store}>
      <SocketContext.Provider value={{ socket }}>
        <App />
      </SocketContext.Provider>
    </Provider>
  );
};

export default init;