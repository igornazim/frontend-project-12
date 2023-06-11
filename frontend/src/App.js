import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./Components/RegistrationForm.jsx";
import AuthorisationForm from "./Components/AuthorisationForm.jsx";
import Chat from "./Components/Chat.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import Navigation from "./Navigation.jsx";
import Page404 from "./Page404.jsx";
import AuthContext from "./contexts/Index.jsx";

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const logIn = (user) => {
    const { token } = user;
    localStorage.setItem("userId", JSON.stringify(token));
    setCurrentUser(user);
  };
  const logOut = () => {
    localStorage.removeItem("userId");
    setCurrentUser(null);
  };

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
