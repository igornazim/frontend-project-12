import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import ApiContext from './contexts/socket';
import App from './App';
import store from './slices/index';
import resources from './locales/index';

const init = async () => {
  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    environment: 'production',
  };

  const socket = io();

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
            <ApiContext.Provider value={{ socket }}>
              <App />
            </ApiContext.Provider>
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
