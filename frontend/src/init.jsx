import App from './App';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import SocketContext from "./contexts/socket.jsx";
import { io } from "socket.io-client";
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import resources from './locales/index.js';

const init = async () => {
  const socket = io();
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  return (
    <I18nextProvider i18n={i18nextInstance}>
      <Provider store={store}>
        <SocketContext.Provider value={{ socket }}>
          <App />
        </SocketContext.Provider>
      </Provider>
    </I18nextProvider>
  );
};

export default init;