import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/forms/RegistrationForm.jsx";
import AuthorisationForm from "./components/forms/AuthorisationForm.jsx";
import Chat from "./components/Chat.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Navigation from "./Navigation.jsx";
import Page404 from "./Page404.jsx";
import AuthContext from "./contexts/Index.jsx";

const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const logIn = (user) => {
    setCurrentUser(user);
  };
  const logOut = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const [currentUser, setCurrentUser] = useState(userData);

  return (
    <AuthContext.Provider value={{ currentUser, logIn, logOut }}>
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
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
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
