/* eslint-disable react/jsx-no-constructed-context-values */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/forms/RegistrationForm.jsx';
import AuthorisationForm from './components/forms/AuthorisationForm.jsx';
import Chat from './components/chat/Chat.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navigation from './Navigation.jsx';
import Page404 from './Page404.jsx';
import AuthContext from './contexts/Index.jsx';

const AuthProvider = ({ children }) => {
  const logIn = (dataName, resData) => localStorage.setItem(dataName, JSON.stringify(resData));
  const logOut = (user) => localStorage.removeItem(user);
  const getUser = (dataName) => JSON.parse(localStorage.getItem(dataName));

  return (
    <AuthContext.Provider value={{
      logIn, logOut, getUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            )}
          />
          <Route path="signup" element={<RegistrationForm />} />
          <Route path="login" element={<AuthorisationForm />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
