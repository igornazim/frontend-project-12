import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './Components/RegistrationForm.jsx';
import AuthorisationForm from './Components/AuthorisationForm.jsx';
import Chat from './Components/Chat.jsx';
import AuthRoute from './Components/AuthRoute.jsx';
import Navigation from './Navigation.jsx';
import Page404 from './Page404.jsx';
import AuthContext from './Contexts/Index.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="d-flex flex-column h-100">
      <Navigation />
        <Routes>
            <Route
            path="/"
            element={(
              <AuthRoute>
                <Chat />
              </AuthRoute>
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
};

export default App;
