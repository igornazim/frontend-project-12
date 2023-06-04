import { Navigate, useLocation } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const location = useLocation();

  return (
    userId.token ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

export default AuthRoute;