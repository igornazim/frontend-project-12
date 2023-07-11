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

  const socketEmetWrapper = (method, data) => socket.emit(method, data);
  /* const socketMap = {
    newMessage: async (data) => {
      await socket.emit('newMessage', data);
    },
    newChannel: (data) => socket.emit('newChannel', data),
    renameChannel: (data) => socket.emit('renameChannel', data),
    removeChannel: (data) => socket.emit('removeChannel', data),
  }; */

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
            <ApiContext.Provider value={{ socketEmetWrapper }}>
              <App />
            </ApiContext.Provider>
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
