import App from './App';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import SocketContext from "./contexts/socket.jsx";
import { io } from "socket.io-client";
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import resources from './locales/index.js';
import { Provider as RollbarProvider } from '@rollbar/react';

const init = async () => {
  const rollbarConfig = {
    accessToken: '382c69313d6142bf91379e384ff9b6aa',
    environment: 'production',
  };

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
    <RollbarProvider config={rollbarConfig}>
      <I18nextProvider i18n={i18nextInstance}>
        <Provider store={store}>
          <SocketContext.Provider value={{ socket }}>
            <App />
          </SocketContext.Provider>
        </Provider>
      </I18nextProvider>
    </RollbarProvider>
  );
};

export default init;