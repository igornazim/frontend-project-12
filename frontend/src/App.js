import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./Components/RegistrationForm";
import AuthorisationForm from "./Components/AuthorisationForm";
import Navigation from "./Navigation.jsx";
import Page404 from "./Page404.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<AuthorisationForm />} />
          <Route path="signup" element={<RegistrationForm />} />
          <Route path="login" element={<AuthorisationForm />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
