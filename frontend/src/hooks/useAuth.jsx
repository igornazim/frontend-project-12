import { useContext } from 'react';

import authContext from '../contexts/useAuth';

const useAuth = () => useContext(authContext);

export default useAuth;
