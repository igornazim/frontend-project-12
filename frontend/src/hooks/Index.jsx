import { useContext } from 'react';

import authContext from '../contexts/Index';

const useAuth = () => useContext(authContext);

export default useAuth;
