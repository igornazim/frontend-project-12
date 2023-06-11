import { Navigate, useLocation } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem("userId"));
  const location = useLocation();
  if (userId && userId.token) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default AuthRoute;