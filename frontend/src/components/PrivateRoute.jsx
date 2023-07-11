import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthRoute = ({ children }) => {
  const { getUser } = useAuth();

  const user = getUser('user');
  const location = useLocation();
  if (user && user.token) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default AuthRoute;
