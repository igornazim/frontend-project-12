import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import ApiContext from './contexts/useApi';
import App from './App';
import store from './slices/index';
import resources from './locales/index';
import { addMessage } from './slices/messagesSlice';
import {
  addChannel, updateChannel, removeChannel, setCurrentChannelId,
} from './slices/channelsSlice';

const init = async () => {
  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    environment: 'production',
  };

  const socket = io();
  socket.on('newMessage', (payload) => store.dispatch(addMessage(payload)));
  socket.on('newChannel', (payload) => {
    store.dispatch(addChannel(payload));
    store.dispatch(setCurrentChannelId(payload.id));
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(updateChannel({ id: payload.id, changes: payload }));
    store.dispatch(setCurrentChannelId(payload.id));
  });
  socket.on('removeChannel', (payload) => {
    store.dispatch(removeChannel(payload.id));
  });

  const promisify = (f) => (...args) => new Promise((resolve, reject) => {
    const callback = (response) => {
      if (response.status === 'ok') {
        resolve(response.status);
      } else {
        reject(response);
      }
    };

    f(...args, callback);
  });

  const mapping = {
    newMessage: promisify((data, cb) => socket.emit('newMessage', data, cb)),
    newChannel: promisify((data, cb) => socket.emit('newChannel', data, cb)),
    renameChannel: promisify((data, cb) => socket.emit('renameChannel', data, cb)),
    removeChannel: promisify((data, cb) => socket.emit('removeChannel', data, cb)),
  };

  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18nextInstance}>
          <Provider store={store}>
            <ApiContext.Provider value={{ mapping }}>
              <App />
            </ApiContext.Provider>
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
