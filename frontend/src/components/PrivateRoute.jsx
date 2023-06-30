import { Navigate, useLocation } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  if (user && user.token) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default AuthRoute;
